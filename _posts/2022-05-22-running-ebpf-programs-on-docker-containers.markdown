---
layout: post
title:  "Running eBPF programs on Docker containers"
description: "Creating a Docker image to run BPF programs with libbpf, and troubleshooting Ubuntu issues."
date:   2022-05-22 23:20:00
tags: [bpf, operating-systems, docker]
comments: true
share: true
---

eBPF [is an amazing technology](https://ebpf.io/what-is-ebpf) that allows us to extend the capabilities of the Linux kernel without requiring to change kernel source code or load kernel modules. It gives us the power to experiment how kernel function works without kernel development experience, and without having to spend dozens of hours setting things up for kernel development.

Unfortunately, getting started with BPF can still be a bit intimidating. To run a simple "hello world" we must ensure the OS is all set up having some permissions set, build dependencies, and a bunch of kernel capabilities. Because of that, I have been using Docker containers to run BPF experiments and take leverage of its isolated aspect (cgroups, namespaces, and OS virtualization) to quickly start running BPF code.

## Prerequisites

BPF is a relatively new technology and it is constantly evolving, which means you will need newer kernel versions and different dependencies depending on the BPF new features you want to use. BPF programs are usually written in C language, with some code conventions that could also vary depending on which context you are using BPF: security, networking, profiling, observability, etc. 

That being said, to run a trivial BPF program with a minimal setup we need Clang to compile BPF code, llvm, zlib and libelf (libelf-dev). Most of these are dependencies of the [libbpf](https://github.com/libbpf/libbpf) library, used to load, unload, check and relocate BPF programs. A simple Dockerfile to install all these dependencies would look like this:

<script src="https://gist.github.com/andreybleme/fd62a2a277d0babb619152c9708e8433.js"></script>

I'm using the [libbpf-bootstrap](https://github.com/libbpf/libbpf-bootstrap) repository that contains demo BPF apps that are very useful for getting started, it also comes with a Make file providing commands to build binaries and reading debug output. You can see details on how libbpf-bootstrap works by reading [this amazing article](https://nakryiko.com/posts/libbpf-bootstrap/) by Andrii Nakryiko.

So other than installing all the previously mentioned dependencies, the Dockerfile clones the [libbpf-bootstrap](https://github.com/libbpf/libbpf-bootstrap) git repository and builds [libbpf](https://github.com/libbpf/libbpf) as a static dependency. Note that [libbpf](https://github.com/libbpf/libbpf) is a git submodule under the [libbpf-bootstrap](https://github.com/libbpf/libbpf-bootstrap) repository, but it could also be installed directly through its own mirror repository if you are not running BPF code from the [libbpf-bootstrap](https://github.com/libbpf/libbpf-bootstrap).

With this Dockerfile, you can build an "ebpf-playground" image:

```
$ docker build . -t ebpf-playground:1.0.0
```

Traditionally, the [debugfs](https://linuxlink.timesys.com/docs/wiki/engineering/HOWTO_Use_debugfs) is supposed to be mounted at /sys/kernel/debug, but unfortunately, Docker build does not support mounting the kernel debug file system. Because of that, after we build our image we should run our container in interactive mode mounting it manually from within it:

```
$ mount -t debugfs none /sys/kernel/debug
```

## Running our minimal BPF program

As the [libbpf-bootstrap](https://github.com/libbpf/libbpf-bootstrap) code describes, to build our minimal BPF program we should run "make minimal" from within "examples/c" folder. After executing it you will see the binary was created:

![BPF Minimal Compiled](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/success_complie_minimal_bpf.png)

After building it, we should run it by simply executing the generated BPF binary `sudo ./minimal`.
That should be enough to have your output generated on `/sys/kernel/debug/tracing/trace_pipe`.

```
root@5a50f0aa1eae:/src/libbpf-bootstrap/examples/c# cat /sys/kernel/debug/tracing/trace_pipe
    logwrite-376     [005] d... 17262.366392: bpf_trace_printk: BPF triggered from PID 373.
    logwrite-376     [005] d... 17262.366452: bpf_trace_printk: BPF triggered from PID 373.
    logwrite-376     [005] d... 17272.364335: bpf_trace_printk: BPF triggered from PID 373.
    logwrite-376     [005] d... 17272.364370: bpf_trace_printk: BPF triggered from PID 373.
```

## CONFIG_BPF_SYSCALL and RLIMIT_MEMLOCK issues

Some errors can happen when you execute the minimal program, a very common one is this one:

```
Couldn't load trivial BPF program. Make sure your kernel supports BPF (CONFIG_BPF_SYSCALL=y) and/or that RLIMIT_MEMLOCK is set to big enough value.
```

![BPF Minimal Error Running](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/error_running_minimal_bpf.png)

That means either our kernel version was not compiled with the CONFIG_BPF_SYSCALL flag set to yes (y), or the RLIMIT_MEMLOCK memory parameter is too small. To check all the flags used during the kernel compilation, we can check the contents of the `boot/config-*` file. I used Ubuntu Jammy (22.04 LTS) to run a minimal eBPF program a few days ago, which means [my kernel configurations](https://serverfault.com/questions/51032/how-do-i-check-what-kernel-options-were-compiled-without-looking-at-boot-config) can be found on `boot/config-5.15.0-30-generic`.

These were the configurations I found when I first see the above-mentioned error:

```
CONFIG_BPF=y
CONFIG_HAVE_EBPF_JIT=y
CONFIG_ARCH_WANT_DEFAULT_BPF_JIT=y

#
# BPF subsystem
#
CONFIG_BPF_SYSCALL=y
CONFIG_BPF_JIT=y
CONFIG_BPF_JIT_ALWAYS_ON=y
CONFIG_BPF_JIT_DEFAULT_ON=y
CONFIG_BPF_UNPRIV_DEFAULT_OFF=y
CONFIG_USERMODE_DRIVER=y
```

All the BPF-related flags were properly set as they should be. The Latest Ubuntu distributions already come with those kernel configs so I quickly acknowledged that this was unlikely the cause of this error message.

The second guess was that the memlock limit for the filesystem was too small, as the message suggests: "RLIMIT_MEMLOCK memory parameter is too small". To [check the current limits](https://ubuntuforums.org/archive/index.php/t-832769.html), we can look at the content of the `/etc/security/limits.conf` file. These are the limits I found when I checked my container configured limits:

```
#<domain>      <type>  <item>         <value>
#
#*             soft    core           200000
#root          hard    core           200000
#*             hard    rss            200000
#@student      hard    nproc          200000
```

That means the limit for the root user was already 200MB, which again, should be adequate to run a very simple BPF program.

After hours of tries and errors changing these memory limits, restarting the container, and manually recompiling the kernel with the BPF flags set, I realized the reason for this error was that the container was not running on privileged mode (!!!)

Docker [privileged mode](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) grants a Docker container root capabilities to all devices on the host system. You should always spin up your BPF container by running: 

```
$ docker run -it --privileged ebpf-playground:1.0.0
```

----

That is it for running BPF programs in an isolated fashion taking leverage of the full capabilities of Docker containers preventing you from messing with your desktop OS. Troubleshooting errors might require a bit of knowledge of OS-related stuff, so I hope this post helps you to understand some of the basic requirements for executing BPF programs with [libbpf](https://github.com/libbpf/libbpf). Have fun!
