---
layout: post
title:  "Huge pages, TLB, and the cost of memory access"
description: "Measuring the impact of huge pages on TLB misses and memory-access performance."
tags: [operating-systems, perf]
date:   2026-08-31 13:13:52
comments: true
share: true
---

While reading papers about networking and Linux performance, I noticed that using huge pages is a common recommendation. The idea is that, with fewer memory pages, the OS needs to perform fewer virtual-to-physical address translations. I understood the concept, but I couldn't find a simple explanation with actual code demonstrating the performance impact of using huge pages instead of standard pages, or even the difference between 2 MB vs 1 GB huge pages. This post demonstrates the impact of huge pages on TLB behavior through a small C benchmark.

## Memory page address translation and the TLB
Memory is managed in blocks called pages. Huge pages are pages larger than the default size of 4 KB. Simply put, huge pages are a benefical because larger pages reduce the total number of pages we need to represent a given amount of memory. With regular 4 KB pages, 1 MB of memory requires 256 pages, and 1 GB of memory requires 256,000 pages, etc. But huge pages can be 2 MB or 1 GB in size. Using 2 MB memory pages to represent 1 GB of memory, for example, would only require 512 pages.

- For 2 MB pages (huge pages): `1,024 MiB / 2 MB = 512 pages`
- For 4 KB pages (standard pages): `1,048,576 KB / 2 MB = 262,144 pages`

The Translation Lookaside Buffer (TLB) is a high-speed cache that lives inside the CPU used to translate virtual page addresses to physical page addresses. It grows with the number of memory pages, and it is heavily used as the read/write operations get more and more frequent in memory intensive applications. Without hugepages, high TLB miss rates occur and it can degrade performance [2].

## Experiment setup
First, we tell the kernel to reserve 512 huge pages, each exactly 2048 kB (2 MB) in size, for a total of 1 GB total memory reserved:

```bash
echo 512 | sudo tee /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```
Then we allocate 1 huge page of 1 GB:
```bash
echo 1 | sudo tee /sys/kernel/mm/hugepages/hugepages-1048576kB/nr_hugepages
```

Some kernel versions may not allow reserving 1 GB hugepages at run time, so reserving them at boot time may be the only option. [1]

## Experiment

How to verify the practical effect of using hugepages? First, we need to write a program that allocates memory and access its pages randomly. Then we run this program, and using `perf` we observe how the TLB behaves with different memory page sizes.

We first include the memory-allocation headers and define the memory and page sizes:

```c
#include <stdint.h>
#include <stdio.h>
#include <sys/mman.h>
// if fails to compile (for MAP_HUGETLB, MAP_HUGE_2MB, MAP_HUGE_1GB)
#include <linux/mman.h>

// 1GiB memory, 4KiB memory page size
#define MEMORY_SIZE 1073741824
#define PAGE_SIZE 4096
```

 Then, inside the `main` function we ask for 1 GB of memory with `mmap`. We use the `PROT_READ | PROT_WRITE` to specify that we want to read and write that memory region, and `MAP_PRIVATE | MAP_ANONYMOUS` to say that this memory is not backed by a file, and it belongs to this process:


```c
int main(void) {
   char *memory = mmap(
        NULL,
        MEMORY_SIZE,
        PROT_READ | PROT_WRITE,
        MAP_PRIVATE | MAP_ANONYMOUS,
        -1,
        0
    );
   if (memory == MAP_FAILED) {
       perror("mmap");
       return 1;
   }
```

We need to calculate how many memory pages exist. In our example: 1 GiB / 4 KiB = 262,144 pages. We then write one byte to each page. We do that to make sure that Linux actually created the mapping for each page. Otherwise, it could simply reserve the virtual memory address range for the process without allocating and mapping the corresponding physical pages. We need that to check the TLB translations.

```c
    // touch each page to ensure it is allocated, the first access to each page will trigger a page fault
    size_t page_count = MEMORY_SIZE / PAGE_SIZE;
    for (size_t i = 0; i < page_count; i++) {
        memory[i * PAGE_SIZE] = 1;
    }
```

Now with the memory pages allocated, we randomly access each page to force the CPU to repeatedly access memory spread throughout the address space. During each access, the code simply increments one byte on the selected page.

```c
    // visit each 4KiB page randomly, do that 100 times
    for (int j = 0; j < 100; j++) {
        for (size_t i = 0; i < page_count; i++) {
            size_t page = rand() % page_count;
            memory[page * PAGE_SIZE] += 1;
        }
    }

    printf("=== memory access completed successfully ===\n");

    munmap(memory, MEMORY_SIZE);

    return 0;
} // end of main
```

It is important that we access memory randomly because modern CPUs are good at optimizing for sequential reads such as `page 0 -> page 1 -> page 2`. We intentionally made access random, such as `page 732 -> page 91023 -> page 221901 -> page 15`, to make it more difficult for the CPU to reuse memory address translations and stress the TLB.

In this experiment, I wanted to compare the results for different hugepage setups:
- Standard 4 KB pages 
- 2 MB huge pages 
- 1 GB huge pages

To do this, we can change the flags passed to `mmap` to explicitly allocate huge pages using `MAP_HUGE_2MB` or `MAP_HUGE_1GB`. The rest of the file remains exactly the same:

```c
// allocate using 2MB huge pages (MAP_HUGE_2MB)
char *memory = mmap(
    NULL,
    MEMORY_SIZE, PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS | MAP_HUGETLB | MAP_HUGE_2MB,
    -1,
    0
);
```

```c
// allocate using 1GiB huge pages (MAP_HUGE_1GB)
char *memory = mmap(
    NULL,
    MEMORY_SIZE, PROT_READ | PROT_WRITE,
    MAP_PRIVATE | MAP_ANONYMOUS | MAP_HUGETLB | MAP_HUGE_1GB,
    -1,
    0
);
```

## Measuring TLB loads, misses, and page faults

Before collecting the results, we compile the three files: one using normal pages, another with 2 MB huge pages, and the last with 1 GB huge pages:

```bash
gcc -O2 -Wall normal_pages.c -o normal_pages
gcc -O2 -Wall huge_2mb.c -o huge_2mb
gcc -O2 -Wall huge_1gb.c -o huge_1gb
```

We then use `perf` to measure CPU cycles, instructions, page faults, dTLB loads and dTLB load misses. We repeat each measure five times to account for possible variability:

```bash
perf stat -r 5 \
   -e cycles,instructions,page-faults,dTLB-loads,dTLB-load-misses \
   ./normal_pages
```

`perf` returns a result similar to the following for each program:
```bash
Performance counter stats for './normal_pages' (5 runs):
    5,353,458,005      cycles                                  ( +-  0.14% )
    2,869,417,305      instructions # 0.54  insn per cycle     ( +-  0.00% )
          262,200      page-faults                             ( +-  0.00% )
      783,483,370      dTLB-loads                              ( +-  0.01% )
       18,445,386      dTLB-load-misses # 2.35% of all dTLB cache accesses  ( +-  0.21% )

          1.58942      +- 0.00530 seconds time elapsed  ( +-  0.33% ) 
```

Here are the results for normal 4 KiB pages, 2 MiB huge pages, and 1 GiB huge pages.

![TLB misses](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/dtlb_load_misses.png "TLB misses")

Figure 1. Graph presenting number of TLB misses by memory page sizes

![TLB page faults](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/page_faults.png "TLB page faults")

Figure 2. Graph presenting number of memory page faults by page sizes

![Execution time](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/execution_time.png "Execution time")

Figure 3. Graph presenting the CPU execution time in seconds for each memory page size

> If you are wondering why **KiB** and **GiB** are used here instead of the more common KB and GB, they stand for kibibyte and gibibyte. This is a representation of data using powers of two, where **1 KiB is 1,024 bytes**. By contrast, KB (kilobyte) and GB (gigabyte) measure data using powers of ten, so **1 KB is 1,000 bytes**. Assuming 1 KB as 1,024 bytes may produce different results when reproducing performance tests. 


## Discussion

Huge pages made the program ~32% faster and reduced TLB misses significantly in our simple experiment. 

However, it is important to mention that huge pages do not make memory necessarily faster. They make large virtual address spaces cheaper to translate, reducing the pressure on TLB operations. Whether that makes the application substantially faster depends on how much of its execution time was being used in address translation in the first place.

Memory intensive applications, such as databases, can highly benefit from huge pages. Same with high-performance networking applications that reserve memory buffers for packet processing. At scale, as millions of packets are processed, returning even a small amount of CPU time back to the application can result in meaningful performance gains.

One example is [TCmalloc](https://github.com/google/tcmalloc), a huge-page-aware memory allocator presented by Google. It is a customized implementation of C’s `malloc` that uses a series of cache optimizations to keep objects of the same size in similarly sized pages. In the results presented in the original paper, the authors reported a 7.7% improvement in RPS and a 2.4% reduction in RAM usage [4].

## References

[1] Reliably allocating huge pages in Linux [https://mazzo.li/posts/check-huge-page.html](https://mazzo.li/posts/check-huge-page.html)

[2] Huge pages kernel documentation [https://www.kernel.org/doc/Documentation/vm/transhuge.txt](https://www.kernel.org/doc/Documentation/vm/transhuge.txt)

[3] Perf demonstration with Rust using 4GiB pages [https://github.com/evanj/hugepagedemo](https://github.com/evanj/hugepagedemo)

[4] Beyond malloc efficiency to fleet efficiency: a hugepage-aware memory allocator [https://www.usenix.org/conference/osdi21/presentation/hunter](https://www.usenix.org/conference/osdi21/presentation/hunter)

