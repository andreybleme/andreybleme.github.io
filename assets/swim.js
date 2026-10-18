/* Buildless SWIM illustrations. Classic script: also works with file:// URLs.
 * Each element owns its timeline, SVG, and controls inside a Shadow DOM.
 * Scenarios are deliberate teaching sequences, not a network simulator.
 */
(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const COLORS = {
    ping: '#0284c7', ack: '#15803d', suspect: '#b45309',
    dead: '#dc2626', alive: '#15803d', unknown: '#a8a29e',
    neutral: '#78716c', exchange: '#7c3aed',
  };
  const TINTS = { alive: '#f0fdf4', suspect: '#fffbeb', dead: '#fef2f2', unknown: '#f5f5f4' };
  const OBSERVERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const message = (from, to, label, kind = 'ping', extra = {}) => ({ from, to, label, kind, ...extra });
  const phase = (title, caption, duration, extra = {}) => ({ title, caption, duration, messages: [], ...extra });
  const update = (state, inc) => ({ state, inc });
  const sameUpdate = (a, b) => a && b && a.state === b.state && a.inc === b.inc;

  // Only the illustrated rules needed here: a higher incarnation wins;
  // at the same incarnation, suspicion supersedes alive, and dead wins.
  // A subject refutes suspicion by increasing its own incarnation.
  function acceptUpdate(current, incoming) {
    if (!current || current.state === 'unknown') return { ...incoming };
    if (incoming.inc < current.inc) return current;
    const priority = { alive: 0, suspect: 1, dead: 2 };
    if (incoming.inc === current.inc && priority[incoming.state] <= priority[current.state]) return current;
    return { ...incoming };
  }

  function failureScenario(mode) {
    const healthy = mode === 'healthy';
    const failed = mode === 'failed';
    const helpers = ['C', 'D', 'E'];
    const initial = { view: update('alive', 4), actual: failed ? 'offline' : 'online' };
    const phases = [
      phase('Choose a peer', 'This is one probe at A. A selects B from its membership list; other nodes run their own probes independently.', 1.9),
      phase('Send a direct ping', 'A sends B a UDP ping. A sequence number lets it match an acknowledgment to this probe.', 2.2, {
        messages: [message('A', 'B', 'ping #42', 'ping', { lost: mode === 'lost', noResponse: failed })],
      }),
    ];
    if (healthy) {
      phases.push(
        phase('B acknowledges', 'B replies with the matching acknowledgment. A does not need any indirect checks.', 2.2, {
          messages: [message('B', 'A', 'ack #42', 'ack')],
        }),
        phase('Probe complete', 'A received an acknowledgment before the deadline. B remains alive in A’s local view.', 3),
      );
      return { initial, phases };
    }
    phases.push(
      phase('Direct probe times out', 'No acknowledgment arrived before the direct-probe timeout. A tries other network paths through three live peers.', 2.1, { timer: 'Direct-probe timeout' }),
      phase('Ask three helpers', 'A sends ping-req(B) to C, D, and E. Each helper is asked to probe B on A’s behalf.', 2.4, {
        messages: helpers.map(peer => message('A', peer, 'ping-req(B)')),
      }),
      phase('Helpers ping B', 'C, D, and E each send a ping to B. Indirect checks can succeed even when the direct A–B path loses packets.', 2.4, {
        messages: helpers.map(peer => message(peer, 'B', 'ping B', 'ping', { noResponse: failed })),
      }),
    );
    if (!failed) {
      phases.push(
        phase('B replies to the helpers', 'B is healthy. Its acknowledgments reach the helpers over working network paths.', 2.4, {
          messages: helpers.map(peer => message('B', peer, 'ack', 'ack')),
        }),
        phase('A receives a relayed acknowledgment', 'The helpers relay the result to A. Just one timely acknowledgment is enough for the probe to succeed.', 2.4, {
          messages: helpers.map(peer => message(peer, 'A', 'relay ack #42', 'ack')),
        }),
        phase('B stays alive', 'The direct path failed, but the indirect probe succeeded. A leaves B alive in its membership view.', 3),
      );
    } else {
      phases.push(
        phase('No acknowledgment arrives', 'B is offline, so neither the direct probe nor the helper probes produce an acknowledgment before the probe deadline.', 2.4, { timer: 'Probe deadline' }),
        phase('A suspects B', 'A changes its local view to suspect and queues SUSPECT(B, 4) for dissemination. The missed probes do not prove that B has crashed.', 2.5, { setView: update('suspect', 4) }),
        phase('Allow time to refute', 'The suspicion timer gives B a chance to hear the report and publish ALIVE with a higher incarnation. In this scenario B remains offline.', 4.5, { timer: 'Suspicion timeout' }),
        phase('A declares B dead', 'The suspicion timer expires with no refutation. A marks B dead locally and queues DEAD(B, 4). Gossip carries the update to other nodes.', 3, { setView: update('dead', 4) }),
      );
    }
    return { initial, phases };
  }

  function membershipScenario(mode, transport, drop) {
    const refute = mode === 'refute';
    const join = mode === 'join';
    const news = update(join || refute ? 'alive' : 'dead', join ? 0 : refute ? 5 : 4);
    const old = update(join ? 'unknown' : refute ? 'suspect' : 'alive', join ? null : 4);
    const initial = { views: Object.fromEntries(OBSERVERS.map(id => [id, { ...old }])), subject: join ? 'joining' : refute ? 'online' : 'offline', subjectInc: join ? 0 : 4 };
    const label = `G ${news.state} · ${news.inc}`;
    const packet = (from, to, extra = {}) => message(from, to,
      transport === 'probe' ? `ping + ${label}` : label, news.state,
      { update: news, piggyback: transport === 'probe', ...extra });
    const exchange = (from, to, extra = {}) => transport === 'probe'
      ? [packet(from, to, { sendAt: .12, arriveAt: .66, ...extra }),
        ...(!extra.lost ? [message(to, from, 'ack', 'ack', { sendAt: .72, arriveAt: .94 })] : [])]
      : [packet(from, to, extra)];
    const phases = [];
    if (refute) {
      phases.push(
        phase('G hears its own suspicion', 'The peers currently suspect G at incarnation 4. A sends that report to G, which is actually healthy.', 2.4, {
          messages: [message('A', 'G', 'G suspect · 4', 'suspect')],
        }),
        phase('G refutes the report', 'Only G can increase its own incarnation. G increments it to 5 and queues ALIVE(G, 5), newer than SUSPECT(G, 4).', 2.5, { subjectInc: 5 }),
        phase('A learns the newer state', 'G sends its alive update to A. A replaces its suspicion, clears its suspicion timer, and queues the newer update.', 2.5, {
          messages: [message('G', 'A', label, 'alive', { update: news })],
        }),
      );
    } else if (join) {
      phases.push(
        phase('G joins through a known peer', 'G contacts A to join. This exchange is shown abstractly; Memberlist uses a full state exchange for joining.', 2.5, {
          messages: [message('G', 'A', 'join / state exchange', 'exchange', { update: news })],
        }),
      );
    } else {
      phases.push(
        phase('One node learns the news', 'A’s suspicion timer for G has expired. A marks G dead and queues DEAD(G, 4). The other nodes still have their old local views.', 2.6, {
          setViews: { A: news },
        }),
      );
    }
    const how = transport === 'probe'
      ? 'In two successive probe exchanges, A sends a ping carrying the update, then receives an ack. This is the piggybacking approach in the SWIM paper.'
      : 'Here A sends dedicated gossip messages, as in the Memberlist gossip function in your post. Probe traffic runs separately.';
    phases.push(
      phase('A tells a few peers', how, transport === 'probe' ? 4.4 : 2.7, { messages: transport === 'probe' ? [
        packet('A', 'B', { sendAt: .04, arriveAt: .32 }),
        message('B', 'A', 'ack', 'ack', { sendAt: .35, arriveAt: .48 }),
        packet('A', 'C', { sendAt: .52, arriveAt: .8 }),
        message('C', 'A', 'ack', 'ack', { sendAt: .83, arriveAt: .96 }),
      ] : [packet('A', 'B'), packet('A', 'C')] }),
      phase('Receive, update, queue', 'B and C have accepted the update. They each queue it for further transmission. Their views now differ from D, E, and F.', 2.2, {
        messages: [],
      }),
    );
    if (refute) {
      phases.push(
        phase('An old report arrives late', 'D sends an old suspicion to A. A already has ALIVE(G, 5), so it ignores SUSPECT(G, 4). The old incarnation cannot undo the refutation.', 2.7, {
          messages: [message('D', 'A', 'G suspect · 4', 'suspect', { update: update('suspect', 4), stale: true })],
        }),
      );
    }
    phases.push(
      phase('The receivers pass it on', 'B tells D and C tells E. A also repeats the update to B: gossip can reach a node that already knows the news.', 2.7, {
        messages: [...exchange('B', 'D'), ...exchange('C', 'E'), ...exchange('A', 'B', { duplicate: true })],
      }),
      phase('More local views agree', 'D and E accept the update and queue it. B ignores the duplicate. F has not received the news yet.', 2.2, {
        messages: [],
      }),
      phase('D tries to reach F', drop ? 'This packet is lost. F keeps its old view; sending an update does not mean that it has been received.' : 'D passes the queued update to F. There is no central broadcaster: receivers become senders.', 2.7, {
        messages: exchange('D', 'F', { lost: drop }),
      }),
      phase('Another path reaches F', drop ? 'E sends the same update to F on another path. Retransmission gives a missed update another chance to arrive.' : 'E also sends the update to F. F already has this version, so the duplicate does not change its view.', 2.7, {
        messages: exchange('E', 'F', { duplicate: !drop }),
      }),
      phase('The views converge', 'All six peers now agree about G. Updates are retransmitted a bounded number of times. Memberlist also periodically exchanges full membership views to repair missed gossip.', 3.4, {
        messages: [],
      }),
    );
    return { initial, phases, news };
  }

  const styles = `
    :host { display:block; margin:24px 0; --swim-bg:#fff; --swim-ink:#292524; --swim-muted:#78716c; --swim-line:#e7e5e4; font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:var(--swim-ink); }
    * { box-sizing:border-box; }
    .frame { background:var(--swim-bg); border:1px solid var(--swim-line); border-radius:8px; overflow:hidden; }
    .options { display:flex; align-items:center; flex-wrap:wrap; gap:12px; padding:14px 18px; border-bottom:1px solid var(--swim-line); background:#fafaf9; }
    label { display:flex; align-items:center; gap:7px; font-size:12px; color:#57534e; }
    select { max-width:100%; border:1px solid #d6d3d1; border-radius:4px; background:white; padding:6px 25px 6px 9px; font:inherit; color:var(--swim-ink); }
    input[type=checkbox] { accent-color:#57534e; }
    .readout { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:16px 20px 0; font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace; }
    .status { color:#15803d; font-weight:600; }
    .hint { color:var(--swim-muted); text-align:right; }
    svg { width:100%; height:auto; display:block; overflow:visible; }
    svg text { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; }
    .legend { display:flex; justify-content:center; flex-wrap:wrap; gap:18px; padding:0 14px 15px; color:var(--swim-muted); font-size:11px; }
    .legend span { display:flex; align-items:center; gap:6px; }
    .dot { width:7px; height:7px; border-radius:50%; display:inline-block; }
    .explanation { border-top:1px solid var(--swim-line); padding:16px 20px; min-height:125px; background:#fafaf9; }
    .phase-heading { display:flex; align-items:baseline; gap:10px; margin-bottom:6px; }
    .step-label { color:var(--swim-muted); font:11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace; white-space:nowrap; }
    h3 { font-size:14px; font-weight:600; margin:0; }
    .caption { margin:0; font-size:13px; line-height:1.65; color:#57534e; }
    .timer { display:none; align-items:center; gap:10px; margin:9px 0 0; font-size:11px; color:var(--swim-muted); }
    .timer[data-visible=true] { display:flex; }
    .timer-track { height:3px; flex:1; background:#e7e5e4; border-radius:3px; overflow:hidden; }
    .timer-fill { height:100%; background:#b45309; transform-origin:left; }
    .scrub { display:block; width:calc(100% - 40px); margin:10px 20px 0; height:16px; accent-color:#78716c; cursor:pointer; }
    .controls { display:flex; align-items:center; flex-wrap:wrap; gap:7px; padding:10px 16px 14px; }
    button { font:12px/1.5 system-ui,sans-serif; background:white; color:#57534e; border:1px solid #d6d3d1; border-radius:4px; padding:6px 10px; cursor:pointer; }
    button:hover { background:#f5f5f4; color:#292524; }
    button.play { min-width:76px; }
    button:disabled { opacity:.4; cursor:default; }
    button:focus-visible, select:focus-visible, input:focus-visible { outline:2px solid #0284c7; outline-offset:3px; }
    .speed { margin-left:auto; white-space:nowrap; }
    .speed input { width:74px; accent-color:#78716c; }
    .speed output { min-width:28px; color:#57534e; }
    .footnote { color:var(--swim-muted); font-size:11px; text-align:center; margin:9px 5px 0; }
    @media (max-width:520px) {
      .options { padding:12px; gap:9px; }
      .readout { padding:14px 12px 0; font-size:10px; }
      .explanation { padding:14px 12px; min-height:147px; }
      .legend { gap:11px; font-size:10px; }
      .controls { padding:10px 12px 12px; }
      .speed { gap:4px; } .speed input { width:52px; }
      button { padding:6px 8px; }
      .phase-heading { gap:7px; } h3 { font-size:13px; }
    }
  `;

  function svgElement(tag, attributes = {}, text = null) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text !== null) element.textContent = text;
    return element;
  }

  class SwimAnimation extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true;
      this.kind = this.getAttribute('kind') === 'membership' ? 'membership' : 'failure';
      this.time = 0;
      this.speed = 1;
      this.playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.visible = true;
      this.lastFrame = null;
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="frame">
          <div class="options">
            <label>Scenario <select class="scenario" aria-label="Animation scenario">${this.kind === 'failure' ? `
              <option value="failed">B has failed</option>
              <option value="healthy">Healthy response</option>
              <option value="lost">Direct path lost</option>` : `
              <option value="dead">Failure update</option>
              <option value="join">New member joins</option>
              <option value="refute">Refute suspicion</option>`}</select></label>
            ${this.kind === 'membership' ? `
              <label>Messages <select class="transport" aria-label="Update transport">
                <option value="probe">Probe + update</option><option value="gossip">Memberlist gossip</option>
              </select></label>
              <label><input class="drop" type="checkbox"> Lose one packet</label>` : ''}
          </div>
          <div class="readout"><span class="status"></span><span class="hint"></span></div>
          <svg role="img" aria-label="Animated SWIM message flow"><title></title><desc></desc></svg>
          <div class="legend">${this.kind === 'failure' ? `
            <span><i class="dot" style="background:${COLORS.ping}"></i>ping / ping-req</span>
            <span><i class="dot" style="background:${COLORS.ack}"></i>ack</span>
            <span><i class="dot" style="background:${COLORS.suspect}"></i>suspect</span>
            <span><i class="dot" style="background:${COLORS.dead}"></i>dead</span>` : `
            <span>Labels = each peer’s view of G</span><span>@ = incarnation</span>`}</div>
          <div class="explanation" aria-live="polite" aria-atomic="true">
            <div class="phase-heading"><span class="step-label"></span><h3></h3></div>
            <p class="caption"></p>
          </div>
          <div class="timer"><span></span><div class="timer-track"><div class="timer-fill"></div></div></div>
          <input class="scrub" type="range" min="0" max="1000" value="0" aria-label="Animation timeline">
          <div class="controls">
            <button class="play" type="button"></button>
            <button class="reset" type="button" aria-label="Reset animation">↺ Reset</button>
            <button class="next" type="button" aria-label="Advance to the next step">Next →</button>
            <label class="speed">Speed <input type="range" min="0.5" max="2" value="1" step="0.25" aria-label="Playback speed"><output>1×</output></label>
          </div>
        </div>
        <p class="footnote">Illustrative timing · chosen peer sequence · ${this.kind === 'failure' ? 'one probe, viewed from A' : 'local views converge over independent exchanges'}</p>`;
      this.$ = selector => this.shadowRoot.querySelector(selector);
      this.svg = this.$('svg');
      this.$('.scenario').addEventListener('change', () => this.resetScenario());
      this.$('.transport')?.addEventListener('change', () => this.resetScenario());
      this.$('.drop')?.addEventListener('change', () => this.resetScenario());
      this.$('.play').addEventListener('click', () => {
        if (this.time >= this.total) { this.time = 0; this.playing = true; }
        else this.playing = !this.playing;
        this.lastFrame = null;
        this.render();
      });
      this.$('.reset').addEventListener('click', () => { this.time = 0; this.lastFrame = null; this.render(); });
      this.$('.next').addEventListener('click', () => {
        this.playing = false;
        const next = this.phases.find(item => item.start > this.time + 0.001);
        this.time = next ? next.start : this.total;
        this.render();
      });
      this.$('.scrub').addEventListener('input', event => {
        this.playing = false;
        this.time = Number(event.target.value) / 1000 * this.total;
        this.render();
      });
      this.$('.speed input').addEventListener('input', event => {
        this.speed = Number(event.target.value);
        this.$('.speed output').textContent = `${this.speed}×`;
      });
      this.resizeObserver = new ResizeObserver(() => { this.compact = this.clientWidth < 520; this.render(); });
      this.resizeObserver.observe(this);
      this.intersectionObserver = new IntersectionObserver(entries => { this.visible = entries[0].isIntersecting; this.lastFrame = null; });
      this.intersectionObserver.observe(this);
      this.resetScenario();
      const animate = now => {
        if (!this.isConnected) return;
        if (this.playing && this.visible && !document.hidden) {
          if (this.lastFrame !== null) this.time = Math.min(this.total, this.time + Math.min((now - this.lastFrame) / 1000, 0.1) * this.speed);
          if (this.time >= this.total) this.playing = false;
          this.render();
        }
        this.lastFrame = now;
        this.animationFrame = requestAnimationFrame(animate);
      };
      this.animationFrame = requestAnimationFrame(animate);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.animationFrame);
      this.resizeObserver?.disconnect();
      this.intersectionObserver?.disconnect();
      // Permit the same element to be removed and mounted again.
      this.ready = false;
    }

    resetScenario() {
      this.scenario = this.kind === 'failure'
        ? failureScenario(this.$('.scenario').value)
        : membershipScenario(this.$('.scenario').value, this.$('.transport').value, this.$('.drop').checked);
      let start = 0;
      this.phases = this.scenario.phases.map(item => {
        const result = { ...item, start };
        start += item.duration;
        return result;
      });
      this.total = start;
      this.time = 0;
      this.lastPhase = -1;
      this.lastFrame = null;
      this.compact = this.clientWidth < 520;
      this.render();
    }

    // Rebuild local state from the timeline so seeking backward is exact.
    // Packet arrivals apply near the end of each message's travel, never at send time.
    snapshot() {
      const state = JSON.parse(JSON.stringify(this.scenario.initial));
      let index = this.phases.findIndex(item => this.time < item.start + item.duration);
      if (index === -1) index = this.phases.length - 1;
      for (let i = 0; i <= index; i++) {
        const item = this.phases[i];
        const progress = i < index ? 1 : Math.min(1, (this.time - item.start) / item.duration);
        if (item.setView) state.view = { ...item.setView };
        if (item.setViews) Object.entries(item.setViews).forEach(([id, value]) => { state.views[id] = { ...value }; });
        if (item.subjectInc !== undefined) state.subjectInc = item.subjectInc;
        item.messages.forEach(msg => {
            if (progress >= (msg.arriveAt ?? .83) && msg.update && !msg.lost && state.views?.[msg.to]) {
              state.views[msg.to] = acceptUpdate(state.views[msg.to], msg.update);
              if (state.subject === 'joining') state.subject = 'online';
            }
        });
      }
      const item = this.phases[index];
      return { state, index, item, progress: Math.max(0, Math.min(1, (this.time - item.start) / item.duration)) };
    }

    positions() {
      if (this.kind === 'failure') return this.compact
        ? { A:[75,90], B:[345,90], C:[75,280], D:[210,310], E:[345,280] }
        : { A:[125,100], B:[635,100], C:[220,270], D:[380,285], E:[540,270] };
      return this.compact
        ? { A:[75,80], B:[210,50], C:[345,80], D:[345,265], E:[210,320], F:[75,265], G:[210,185] }
        : { A:[185,80], B:[380,50], C:[575,80], D:[575,255], E:[380,300], F:[185,255], G:[380,175] };
    }

    render() {
      if (!this.scenario) return;
      const { state, index, item, progress } = this.snapshot();
      this.$('.play').textContent = this.time >= this.total ? '↺ Replay' : this.playing ? 'Ⅱ Pause' : '▶ Play';
      this.$('.play').setAttribute('aria-label', this.time >= this.total ? 'Replay animation' : this.playing ? 'Pause animation' : 'Play animation');
      this.$('.next').disabled = this.time >= this.total;
      this.$('.scrub').value = Math.round(this.time / this.total * 1000);
      this.$('.scrub').setAttribute('aria-valuetext', `Step ${index + 1} of ${this.phases.length}: ${item.title}`);
      if (index !== this.lastPhase) {
        this.$('.step-label').textContent = `${String(index + 1).padStart(2, '0')} / ${String(this.phases.length).padStart(2, '0')}`;
        this.$('h3').textContent = item.title;
        this.$('.caption').textContent = item.caption;
        this.lastPhase = index;
      }
      this.$('.timer').dataset.visible = Boolean(item.timer);
      this.$('.timer > span').textContent = item.timer || '';
      this.$('.timer-fill').style.transform = `scaleX(${1 - progress})`;
      this.$('.timer').style.marginLeft = this.$('.timer').style.marginRight = '20px';
      const status = this.$('.status');
      if (this.kind === 'failure') {
        status.textContent = `A’s view of B: ${state.view.state.toUpperCase()} @${state.view.inc}`;
        status.style.color = COLORS[state.view.state];
        this.$('.hint').textContent = state.actual === 'offline' ? 'B is offline' : 'B is healthy';
      } else {
        const count = OBSERVERS.filter(id => sameUpdate(state.views[id], this.scenario.news)).length;
        status.textContent = `${count} / 6 peers have the update`;
        status.style.color = count === 6 ? COLORS.alive : '#57534e';
        this.$('.hint').textContent = `Update: G ${this.scenario.news.state} @${this.scenario.news.inc}`;
      }
      const positions = this.positions();
      const width = this.compact ? 420 : 760;
      const height = this.kind === 'failure' ? (this.compact ? 390 : 360) : (this.compact ? 400 : 380);
      this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      this.svg.replaceChildren(
        svgElement('title', {}, `${this.kind === 'failure' ? 'SWIM failure detection' : 'SWIM membership dissemination'} — ${item.title}`),
        svgElement('desc', {}, `${item.caption} ${status.textContent}. ${this.kind === 'membership' ? OBSERVERS.map(id => `${id}: G ${state.views[id].state} incarnation ${state.views[id].inc ?? 'unknown'}`).join('. ') : ''}`),
      );
      const connections = svgElement('g');
      const nodes = svgElement('g');
      const packets = svgElement('g');
      this.svg.append(connections, nodes, packets);
      item.messages.forEach((msg, i) => this.drawMessage(msg, i, progress, positions, connections, packets));
      Object.entries(positions).forEach(([id, position]) => this.drawNode(id, position, state, nodes));
      if (this.kind === 'failure' && (state.view.state === 'suspect' || state.view.state === 'dead')) {
        const color = COLORS[state.view.state];
        const y = this.compact ? 190 : 185;
        this.svg.append(svgElement('rect', { x:width/2-106, y:y-17, width:212, height:34, rx:5, fill:TINTS[state.view.state], stroke:color, 'stroke-opacity':'.2' }));
        this.svg.append(svgElement('text', { x:width/2, y:y+5, 'text-anchor':'middle', fill:color, 'font-size':13 }, `queued: ${state.view.state.toUpperCase()}(B, 4)`));
      }
    }

    drawNode(id, [x, y], state, group) {
      const isFailure = this.kind === 'failure';
      const subject = isFailure ? id === 'B' : id === 'G';
      const offline = subject && (isFailure ? state.actual === 'offline' : state.subject === 'offline');
      const view = !isFailure && !subject ? state.views[id] : null;
      const knows = view && sameUpdate(view, this.scenario.news);
      const fill = offline ? '#f5f5f4' : '#fafaf9';
      const border = isFailure && id === 'A' ? COLORS.ping : knows ? COLORS[view.state] : '#a8a29e';
      const node = svgElement('g', { transform:`translate(${x} ${y})` });
      node.append(svgElement('circle', { r:25, fill, stroke:border, 'stroke-width':1.6, ...(offline ? { 'stroke-dasharray':'4 4' } : {}) }));
      node.append(svgElement('text', { x:0, y:7, 'text-anchor':'middle', fill:offline ? '#a8a29e' : '#44403c', 'font-size':22 }, id));
      if (isFailure) {
        const role = id === 'A' ? 'probing node' : id === 'B' ? offline ? 'offline' : 'target' : 'helper';
        node.append(svgElement('text', { x:0, y:id === 'A' || id === 'B' ? -39 : 46, 'text-anchor':'middle', fill:'#78716c', 'font-size':12 }, role));
      } else if (subject) {
        const role = state.subject === 'offline' ? 'offline' : state.subject === 'joining' ? 'joining' : `healthy · @${state.subjectInc}`;
        node.append(svgElement('text', { x:0, y:44, 'text-anchor':'middle', fill:'#78716c', 'font-size':11 }, role));
      } else {
        const text = view.state === 'unknown' ? 'G unknown' : `G ${view.state} @${view.inc}`;
        const badgeWidth = text.length * 6.5 + 14;
        const badgeY = y < 140 ? -48 : 35;
        node.append(svgElement('rect', { x:-badgeWidth/2, y:badgeY, width:badgeWidth, height:23, rx:4, fill:TINTS[view.state] }));
        node.append(svgElement('text', { x:0, y:badgeY+16, 'text-anchor':'middle', fill:COLORS[view.state], 'font-size':11 }, text));
        if (knows) node.append(svgElement('circle', { cx:19, cy:-19, r:4, fill:COLORS[view.state], stroke:'white', 'stroke-width':1.5 }));
      }
      group.append(node);
    }

    drawMessage(msg, index, progress, positions, connections, packets) {
      const sendAt = msg.sendAt ?? .12;
      const arriveAt = msg.arriveAt ?? .83;
      if (progress < sendAt) return;
      const [sx, sy] = positions[msg.from];
      const [tx, ty] = positions[msg.to];
      const dx = tx - sx, dy = ty - sy;
      const distance = Math.hypot(dx, dy);
      const ux = dx / distance, uy = dy / distance;
      const start = [sx + ux * 30, sy + uy * 30];
      const end = [tx - ux * 30, ty - uy * 30];
      // Curve packets around node labels; reverse paths naturally bend the other way.
      const bend = this.kind === 'membership' ? 20 + index * 8 : 18 + index * 12;
      const middle = [(start[0] + end[0])/2 + uy * bend, (start[1] + end[1])/2 - ux * bend];
      const color = COLORS[msg.kind];
      const at = t => [
        (1-t)**2 * start[0] + 2*(1-t)*t * middle[0] + t*t * end[0],
        (1-t)**2 * start[1] + 2*(1-t)*t * middle[1] + t*t * end[1],
      ];
      connections.append(svgElement('path', { d:`M ${start.join(' ')} Q ${middle.join(' ')} ${end.join(' ')}`, fill:'none', stroke:color, 'stroke-opacity':'.3', 'stroke-width':1.3, 'stroke-dasharray':msg.lost ? '4 5' : 'none' }));
      // A small arrow at the end makes direction visible even while paused.
      const angle = Math.atan2(end[1] - middle[1], end[0] - middle[0]);
      connections.append(svgElement('path', { d:`M ${end[0]-7*Math.cos(angle-.45)} ${end[1]-7*Math.sin(angle-.45)} L ${end.join(' ')} L ${end[0]-7*Math.cos(angle+.45)} ${end[1]-7*Math.sin(angle+.45)}`, fill:'none', stroke:color, 'stroke-opacity':'.6', 'stroke-width':1.5 }));
      const travel = Math.max(0, Math.min(1, (progress - sendAt) / (arriveAt - sendAt)));
      const t = msg.lost ? Math.min(travel, .58) : travel;
      const [px, py] = at(t);
      if (progress <= arriveAt && (!msg.lost || travel < .58)) {
        packets.append(svgElement('circle', { cx:px, cy:py, r:5.5, fill:color, stroke:'white', 'stroke-width':2 }));
        if (msg.piggyback) packets.append(svgElement('circle', { cx:px - ux*10, cy:py - uy*10, r:3.5, fill:COLORS.ping, stroke:'white', 'stroke-width':1 }));
      }
      const [lx, ly] = at(.5);
      const label = msg.lost && travel >= .58 ? '× lost' : msg.stale && progress >= arriveAt ? 'old update ignored' : msg.duplicate && progress >= arriveAt ? 'already known' : msg.label;
      const textSize = this.compact ? 10 : 11;
      const labelWidth = label.length * textSize * .6 + 12;
      const labelY = ly - 11;
      packets.append(svgElement('rect', { x:lx-labelWidth/2, y:labelY-12, width:labelWidth, height:19, rx:3, fill:'white', 'fill-opacity':'.96' }));
      packets.append(svgElement('text', { x:lx, y:labelY+1, 'text-anchor':'middle', 'font-size':textSize, fill:msg.lost && travel >= .58 ? COLORS.dead : color }, label));
      if (msg.lost && travel >= .58) {
        const [cx, cy] = at(.58);
        packets.append(svgElement('path', { d:`M ${cx-4} ${cy-4} L ${cx+4} ${cy+4} M ${cx-4} ${cy+4} L ${cx+4} ${cy-4}`, stroke:COLORS.dead, 'stroke-width':2 }));
      }
      if (msg.noResponse && progress >= .83) packets.append(svgElement('text', { x:tx-35, y:ty-35-index*15, 'text-anchor':'end', fill:'#78716c', 'font-size':11 }, 'no reply'));
    }
  }

  if (!customElements.get('swim-animation')) customElements.define('swim-animation', SwimAnimation);
})();
