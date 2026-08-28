var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../shared/seed.ts
var seedContent = {
  site: {
    brandName: "Ola Serena",
    brandMark: "Massage & Beach Spa \xB7 B\xE1varo",
    tagline: "Unhurried massage in Los Corales \u2014 in our studio, on the sand, or in your room.",
    heroKicker: "Los Corales \xB7 El Cortecito \xB7 B\xE1varo Beach",
    heroTitle: "Slow down to",
    heroHighlight: "island time",
    heroSubtitle: "A small women-run massage studio two minutes from the sand in Los Corales. We also come to your beach chair or your hotel room \u2014 with our own table, oils and music.",
    heroImage: "",
    heroCtaPrimary: "Reserve on WhatsApp",
    heroCtaSecondary: "See treatments & prices",
    ownerName: "Yaritza Mercedes",
    ownerRole: "Owner & lead therapist",
    ownerQuote: "A good massage should feel like the sea got into your shoulders.",
    ownerStory: "I grew up in Hig\xFCey and have been working with my hands for fourteen years \u2014 first in the big resort spas along B\xE1varo, then on my own. In 2019 I opened this little studio behind the Los Corales beach path so guests could get resort-quality work without resort prices, and so my team could be paid properly. Today four therapists work with me. We are all Dominican, all certified, and we all still get excited when someone falls asleep on the table.",
    ownerPhoto: "",
    whatsapp: "18095550123",
    whatsappGreeting: "Hola! I found you online and I would like to book a massage.",
    phoneDisplay: "+1 809 555 0123",
    email: "hola@olaserena.do",
    addressLine: "Calle Los Corales, behind the beach path",
    neighborhood: "Los Corales / El Cortecito",
    city: "B\xE1varo, Punta Cana",
    mapUrl: "https://maps.google.com/?q=Los+Corales+Bavaro+Punta+Cana",
    mapEmbedUrl: "",
    hours: [
      { label: "Monday \u2013 Saturday", value: "9:00 \u2013 21:00" },
      { label: "Sunday", value: "10:00 \u2013 19:00" },
      { label: "Hotel & beach visits", value: "Until 22:00, last booking 20:30" }
    ],
    languages: ["Espa\xF1ol", "English", "Deutsch (basic)", "Fran\xE7ais (basic)", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439 (basic)"],
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "",
    announcementEnabled: true,
    announcementText: "Same-day appointments are usually possible \u2014 message us on WhatsApp and we answer in minutes.",
    currency: "USD",
    hotelSurcharge: "Hotel and villa visits: +$10 inside B\xE1varo / El Cortecito, +$20 for Cap Cana, Uvero Alto and Punta Cana Village.",
    beachNote: "Beach massages happen under our shade tent on Los Corales beach \u2014 towels, sheets and music included.",
    cancellationPolicy: "Plans change on holiday. Cancel or move your appointment free of charge up to 3 hours before."
  },
  venues: [
    {
      id: "venue-studio",
      name: "Our studio in Los Corales",
      subtitle: "Two minutes from the sand",
      description: "A cool, quiet room behind the beach path \u2014 air conditioning, private shower, herbal tea afterwards. The most comfortable option if you want deep work or a longer session.",
      icon: "home",
      note: "Free filtered water and tea \xB7 private changing area \xB7 card payments accepted",
      order: 1
    },
    {
      id: "venue-beach",
      name: "On the beach",
      subtitle: "Los Corales & El Cortecito",
      description: "We set up a shade tent with a proper table right on the sand, so you keep the sound of the water the whole time. Best in the morning or the golden hour before sunset.",
      icon: "palm",
      note: "Sunrise and sunset slots go first \u2014 book a day ahead if you can",
      order: 2
    },
    {
      id: "venue-hotel",
      name: "Your hotel or villa",
      subtitle: "In-room, all of B\xE1varo & Punta Cana",
      description: "We arrive with a folding table, fresh linens, oils and a small speaker. Works in resort rooms, Airbnbs and villas \u2014 couples can be done side by side in the same room.",
      icon: "bed",
      note: "Tell us the resort name and building when you book so we can pass reception smoothly",
      order: 3
    }
  ],
  services: [
    {
      id: "svc-relax",
      name: "Full Body Relaxing Massage",
      slug: "full-body-relaxing",
      tagline: "The classic \u2014 head to toe, slow and warm",
      description: "Long, flowing Swedish strokes over the whole body with warm coconut or almond oil. Pressure stays gentle to medium; the goal is to switch your nervous system off after a travel day or a long week.",
      benefits: ["Melts travel and flight tension", "Helps you sleep through the night", "Calms sunburnt, tight skin"],
      durations: [
        { minutes: 60, price: 50 },
        { minutes: 90, price: 70 }
      ],
      category: "Signature",
      icon: "wave",
      image: "",
      featured: true,
      popular: true,
      order: 1
    },
    {
      id: "svc-deep",
      name: "Deep Tissue & Sports",
      slug: "deep-tissue",
      tagline: "For knots that came with you from home",
      description: "Firm, focused work through the deeper layers of muscle \u2014 forearms, elbows and slow sustained pressure on the areas you point at. We check in on pressure constantly; it should feel like relief, never like fighting.",
      benefits: ["Releases neck, shoulder and lower-back knots", "Great after surfing, padel or the gym", "Restores range of movement"],
      durations: [
        { minutes: 60, price: 60 },
        { minutes: 90, price: 80 }
      ],
      category: "Therapeutic",
      icon: "spark",
      image: "",
      featured: true,
      popular: true,
      order: 2
    },
    {
      id: "svc-stone",
      name: "Hot Stone Massage",
      slug: "hot-stone",
      tagline: "Warm volcanic basalt along the spine",
      description: "Smooth heated stones are placed along the back and used as an extension of our hands. The heat opens the muscle before we ever press hard, so deep tension lets go without discomfort.",
      benefits: ["Deep warmth without deep pressure", "Wonderful for cold-weather travellers", "Very grounding before bed"],
      durations: [
        { minutes: 60, price: 65 },
        { minutes: 90, price: 85 }
      ],
      category: "Signature",
      icon: "sun",
      image: "",
      featured: true,
      popular: false,
      order: 3
    },
    {
      id: "svc-aroma",
      name: "Aromatherapy Coconut Ritual",
      slug: "aromatherapy",
      tagline: "Island oils, chosen by how you feel",
      description: "You pick the blend when we arrive \u2014 mandarin and vetiver to unwind, mint and eucalyptus to wake up, or plain warm coconut oil pressed here on the island. Gentle full-body work with extra time on scalp and feet.",
      benefits: ["Choose your own scent", "Leaves skin soft after sun and salt", "Long scalp and foot finish"],
      durations: [
        { minutes: 60, price: 55 },
        { minutes: 90, price: 75 }
      ],
      category: "Signature",
      icon: "leaf",
      image: "",
      featured: true,
      popular: false,
      order: 4
    },
    {
      id: "svc-couples",
      name: "Couples Massage",
      slug: "couples",
      tagline: "Two therapists, two tables, side by side",
      description: "Two of us arrive together and work at the same time, in the same room or under the same beach tent. The most-requested thing we do for honeymoons and anniversaries \u2014 finish with sparkling water and a fruit plate.",
      benefits: ["Same room, same hour", "Perfect for honeymoons", "Each person picks their own pressure"],
      durations: [
        { minutes: 60, price: 95 },
        { minutes: 90, price: 135 }
      ],
      category: "Together",
      icon: "heart",
      image: "",
      featured: true,
      popular: true,
      order: 5
    },
    {
      id: "svc-fourhands",
      name: "Four Hands Massage",
      slug: "four-hands",
      tagline: "Two therapists, one very lucky body",
      description: "Two therapists working in mirrored rhythm over one person. The brain gives up trying to track it after about ninety seconds \u2014 which is exactly the point. Our most indulgent hour.",
      benefits: ["Twice the work in the same hour", "Extraordinarily deep switch-off", "A real occasion treatment"],
      durations: [
        { minutes: 60, price: 95 },
        { minutes: 90, price: 130 }
      ],
      category: "Together",
      icon: "spark",
      image: "",
      featured: false,
      popular: false,
      order: 6
    },
    {
      id: "svc-back",
      name: "Back, Neck & Shoulders",
      slug: "back-neck-shoulders",
      tagline: "Short, targeted, straight to the point",
      description: "All the time spent where it actually hurts. Ideal between excursions, after a long flight, or as a quick reset before dinner.",
      benefits: ["Fits into any afternoon", "Focused on desk and travel tension", "No oil in the hair if you ask"],
      durations: [
        { minutes: 30, price: 35 },
        { minutes: 45, price: 45 }
      ],
      category: "Therapeutic",
      icon: "spark",
      image: "",
      featured: false,
      popular: true,
      order: 7
    },
    {
      id: "svc-reflex",
      name: "Foot Reflexology",
      slug: "reflexology",
      tagline: "For feet that walked all of B\xE1varo",
      description: "Pressure-point work through the soles, arches and calves, finishing with a cooling mint balm. Hot sand, flip flops and excursion days are hard on feet \u2014 this fixes them.",
      benefits: ["Relieves swollen, tired feet", "Improves circulation after flights", "Can be done fully clothed"],
      durations: [
        { minutes: 30, price: 30 },
        { minutes: 45, price: 40 }
      ],
      category: "Therapeutic",
      icon: "leaf",
      image: "",
      featured: false,
      popular: false,
      order: 8
    },
    {
      id: "svc-lymph",
      name: "Lymphatic Drainage",
      slug: "lymphatic-drainage",
      tagline: "Light, rhythmic, de-puffing",
      description: "Very light rhythmic strokes that follow the lymphatic pathways to move retained fluid. Popular after long-haul flights, in late pregnancy, and as part of a post-surgery recovery plan.",
      benefits: ["Reduces swelling and heaviness", "Gentle enough for every day", "Post-flight and post-op friendly"],
      durations: [
        { minutes: 60, price: 65 },
        { minutes: 90, price: 90 }
      ],
      category: "Therapeutic",
      icon: "wave",
      image: "",
      featured: false,
      popular: false,
      order: 9
    },
    {
      id: "svc-reductive",
      name: "Reductive & Anti-Cellulite",
      slug: "reductive",
      tagline: "The Dominican classic \u2014 firm and vigorous",
      description: "Strong kneading, wooden tools and rapid percussion over hips, legs and abdomen, the way it is done in salons all over the country. Firm by design \u2014 tell us your limit and we will stay under it.",
      benefits: ["Stimulating and energising", "Often booked as a course of 5", "Combines well with drainage"],
      durations: [
        { minutes: 45, price: 55 },
        { minutes: 60, price: 65 }
      ],
      category: "Therapeutic",
      icon: "spark",
      image: "",
      featured: false,
      popular: false,
      order: 10
    },
    {
      id: "svc-prenatal",
      name: "Prenatal Massage",
      slug: "prenatal",
      tagline: "Side-lying, cushioned, completely safe",
      description: "Second and third trimester work done side-lying with body cushions, focused on lower back, hips and swollen ankles. Two of our therapists hold specific prenatal certification.",
      benefits: ["Relieves lower back and hip load", "Eases swollen feet and ankles", "Certified prenatal therapists"],
      durations: [{ minutes: 60, price: 60 }],
      category: "Therapeutic",
      icon: "heart",
      image: "",
      featured: false,
      popular: false,
      order: 11
    },
    {
      id: "svc-aftersun",
      name: "After-Sun Aloe Ritual",
      slug: "after-sun",
      tagline: "When the Caribbean got you on day one",
      description: "Cool aloe harvested locally, cucumber and chilled towels applied with feather-light strokes \u2014 no deep pressure anywhere. Bring this one to your room on the evening you overdid the sun.",
      benefits: ["Cools and calms burnt skin", "Zero-pressure, feather light", "Rehydrates after sun and salt"],
      durations: [{ minutes: 45, price: 50 }],
      category: "Skin",
      icon: "sun",
      image: "",
      featured: false,
      popular: false,
      order: 12
    },
    {
      id: "svc-scrub",
      name: "Coconut & Coffee Body Scrub",
      slug: "body-scrub",
      tagline: "Exfoliate, rinse, then a full hour of massage",
      description: "Dominican coffee grounds, raw sugar and coconut oil scrubbed over the whole body, rinsed off, then sixty minutes of relaxing massage on brand-new skin. Ninety minutes total.",
      benefits: ["Skin like the first day of holiday", "Scrub plus a full-hour massage", "Made with local coffee and cacao"],
      durations: [{ minutes: 90, price: 85 }],
      category: "Skin",
      icon: "leaf",
      image: "",
      featured: false,
      popular: false,
      order: 13
    }
  ],
  packages: [
    {
      id: "pkg-honeymoon",
      name: "Honeymoon Sunset",
      description: "Two therapists, two tables under our tent on Los Corales beach as the light goes gold, then cold sparkling water and a plate of local fruit.",
      includes: ["90 min couples massage on the beach", "Sunset time slot held for you", "Flower petals & fruit plate", "Photo of the setup if you want one"],
      price: 160,
      duration: "90 min \xB7 for two",
      badge: "Most requested",
      order: 1
    },
    {
      id: "pkg-week",
      name: "The Whole Week",
      description: "Four sessions across your stay, mixed however you like \u2014 deep tissue after the excursion day, relaxing before the flight home.",
      includes: ["4 \xD7 60 min sessions", "Mix any treatments you like", "Same therapist each time if you prefer", "Save $40 against single prices"],
      price: 170,
      duration: "4 \xD7 60 min",
      badge: "Best value",
      order: 2
    },
    {
      id: "pkg-arrival",
      name: "Arrival Reset",
      description: "The one to book for the evening you land. Lymphatic drainage for flight swelling, then reflexology for the feet, in your room.",
      includes: ["60 min lymphatic drainage", "30 min foot reflexology", "In your hotel room", "Late slots until 22:00"],
      price: 85,
      duration: "90 min \xB7 in-room",
      badge: "Day one",
      order: 3
    },
    {
      id: "pkg-bride",
      name: "Bridal Party",
      description: "Up to five people massaged in the same afternoon at your villa or resort suite \u2014 we bring enough therapists that nobody waits long.",
      includes: ["Up to 5 guests", "60 min each", "We bring 2\u20133 therapists", "Villa, suite or beach"],
      price: 240,
      duration: "Half day \xB7 groups",
      badge: "Groups",
      order: 4
    }
  ],
  team: [
    {
      id: "team-yaritza",
      name: "Yaritza",
      role: "Owner \xB7 deep tissue & hot stone",
      bio: "Fourteen years of hands, five of them in the biggest resort spas on this coast. She reads a back in about thirty seconds and is the one to ask for if something genuinely hurts.",
      specialties: ["Deep tissue", "Hot stone", "Sports recovery"],
      languages: ["Espa\xF1ol", "English"],
      years: "14 years",
      photo: "",
      accent: "ocean",
      order: 1
    },
    {
      id: "team-massiel",
      name: "Massiel",
      role: "Relaxing & aromatherapy",
      bio: "The slowest, softest hands on the team. Guests fall asleep on her table constantly, which she takes as the highest possible compliment.",
      specialties: ["Relaxing", "Aromatherapy", "After-sun"],
      languages: ["Espa\xF1ol", "English"],
      years: "7 years",
      photo: "",
      accent: "coral",
      order: 2
    },
    {
      id: "team-carolina",
      name: "Carolina",
      role: "Prenatal & lymphatic drainage",
      bio: "Certified in prenatal and post-operative drainage. Endlessly patient, and the person we send to anyone nervous about being touched by a stranger.",
      specialties: ["Prenatal", "Lymphatic drainage", "Reflexology"],
      languages: ["Espa\xF1ol", "English", "Fran\xE7ais"],
      years: "6 years",
      photo: "",
      accent: "palm",
      order: 3
    },
    {
      id: "team-anyi",
      name: "Anyi",
      role: "Reductive & anti-cellulite",
      bio: "Strong. Genuinely strong. Ask her for the Dominican reductive massage and then hold on \u2014 regulars book her five sessions at a time.",
      specialties: ["Reductive", "Anti-cellulite", "Deep tissue"],
      languages: ["Espa\xF1ol", "English (basic)"],
      years: "5 years",
      photo: "",
      accent: "sun",
      order: 4
    },
    {
      id: "team-dahiana",
      name: "Dahiana",
      role: "Beach sessions & four hands",
      bio: "The one who carries the tent to the sand before sunrise. Loves beach work, big groups, and being half of a four-hands session.",
      specialties: ["Beach massage", "Four hands", "Relaxing"],
      languages: ["Espa\xF1ol", "English", "Deutsch (basic)"],
      years: "4 years",
      photo: "",
      accent: "seafoam",
      order: 5
    }
  ],
  benefits: [
    {
      id: "ben-flight",
      title: "Undo the flight",
      description: "Eight hours in a seat leaves your hips locked and your ankles full of fluid. One session on arrival evening and day two of your holiday actually starts on day two.",
      icon: "plane",
      order: 1
    },
    {
      id: "ben-sleep",
      title: "Sleep through the heat",
      description: "The first nights in the tropics are restless \u2014 new time zone, air conditioning, too much sun. Evening massage drops your nervous system into rest and the night goes quiet.",
      icon: "moon",
      order: 2
    },
    {
      id: "ben-sun",
      title: "Rescue over-sunned skin",
      description: "Caribbean sun is stronger than it feels with a sea breeze on you. Cool aloe, cucumber and a feather-light touch take the sting out of an honest mistake.",
      icon: "sun",
      order: 3
    },
    {
      id: "ben-excursion",
      title: "Recover between excursions",
      description: "Saona, buggies, catamarans, Hoyo Azul \u2014 adventure days are hard on shoulders and calves. Book the evening after and go again tomorrow.",
      icon: "compass",
      order: 4
    },
    {
      id: "ben-local",
      title: "Money that stays on the island",
      description: "You get resort-quality work for roughly half the resort spa price, and five Dominican women get paid directly for it. No middleman, no commission.",
      icon: "heart",
      order: 5
    },
    {
      id: "ben-nomove",
      title: "You never have to move",
      description: "Beach chair, hotel room, villa terrace \u2014 we carry the table, the sheets, the oils and the music. Your only job is to be horizontal.",
      icon: "palm",
      order: 6
    }
  ],
  discover: [
    {
      id: "dsc-loscorales",
      name: "Playa Los Corales",
      category: "Beach",
      blurb: "The stretch of sand right outside our door. Softer crowds than the resort beaches, beach bars every hundred metres, and a shallow reef close to shore.",
      tip: "Walk left toward El Cortecito for the liveliest section, right for the quiet end where the palms lean over the water.",
      walkMinutes: 2,
      priceLevel: "Free",
      mapUrl: "https://maps.google.com/?q=Playa+Los+Corales+Bavaro",
      image: "",
      tags: ["Swimming", "Sunrise", "Beach bars"],
      order: 1
    },
    {
      id: "dsc-cortecito",
      name: "El Cortecito beach village",
      category: "Beach",
      blurb: "The old fishing corner of B\xE1varo \u2014 wooden boats pulled up on the sand, souvenir stalls, and the most authentic little strip on this whole coast.",
      tip: "Prices at the stalls are opening offers. Smile, offer about half, meet near the middle \u2014 it is expected and friendly.",
      walkMinutes: 8,
      priceLevel: "Free",
      mapUrl: "https://maps.google.com/?q=El+Cortecito+Bavaro",
      image: "",
      tags: ["Souvenirs", "Fishing boats", "People watching"],
      order: 2
    },
    {
      id: "dsc-capitancook",
      name: "Capit\xE1n Cook",
      category: "Eat & Drink",
      blurb: "The El Cortecito institution. You pick your fish or lobster from ice, they grill it over coals, and you eat it barefoot with your table on the sand.",
      tip: "Seafood is priced by weight \u2014 ask them to weigh your pick in front of you so the bill holds no surprises.",
      walkMinutes: 9,
      priceLevel: "$$$",
      mapUrl: "https://maps.google.com/?q=Capitan+Cook+El+Cortecito",
      image: "",
      tags: ["Seafood", "On the sand", "Sunset"],
      order: 3
    },
    {
      id: "dsc-soles",
      name: "Soles Chill Out Bar",
      category: "Eat & Drink",
      blurb: "Beanbags in the sand, decent cocktails and a DJ who reads the hour correctly. Our own after-work spot when a shift finishes late.",
      tip: "Go for sunset, stay for the live music that usually starts around nine.",
      walkMinutes: 4,
      priceLevel: "$$",
      mapUrl: "https://maps.google.com/?q=Soles+Chill+Out+Bar+Los+Corales",
      image: "",
      tags: ["Cocktails", "Live music", "Sunset"],
      order: 4
    },
    {
      id: "dsc-loscoralesstrip",
      name: "The Los Corales restaurant strip",
      category: "Eat & Drink",
      blurb: "One walkable street of independent kitchens \u2014 Italian, Argentine grill, sushi, tacos, Dominican criollo. Where everyone eats on the night they escape the buffet.",
      tip: "It fills up after 19:00 in high season. Walk down at 18:30, look at three menus, then pick.",
      walkMinutes: 5,
      priceLevel: "$$",
      mapUrl: "https://maps.google.com/?q=Los+Corales+restaurants+Bavaro",
      image: "",
      tags: ["Dinner", "Walkable", "Variety"],
      order: 5
    },
    {
      id: "dsc-comedor",
      name: "A Dominican comedor",
      category: "Eat & Drink",
      blurb: "The little local canteens serving la bandera \u2014 rice, beans, stewed meat, salad and fried plantain \u2014 for a few hundred pesos. This is what the island actually eats at lunch.",
      tip: 'Go before 13:30, while everything is fresh. Ask for "la bandera con pollo guisado" and you cannot go wrong.',
      walkMinutes: 10,
      priceLevel: "$",
      mapUrl: "https://maps.google.com/?q=comedor+Bavaro+Punta+Cana",
      image: "",
      tags: ["Local food", "Cheap", "Lunch"],
      order: 6
    },
    {
      id: "dsc-saona",
      name: "Isla Saona",
      category: "Excursion",
      blurb: "The postcard island \u2014 catamaran out, speedboat back, a stop at the natural pool where starfish sit in waist-deep water. The one excursion nearly everyone does.",
      tip: "It is a full 12-hour day and the boat gets loud. Book your massage for the evening after, not the morning of.",
      walkMinutes: 0,
      priceLevel: "$$$",
      mapUrl: "https://maps.google.com/?q=Isla+Saona",
      image: "",
      tags: ["Full day", "Catamaran", "Iconic"],
      order: 7
    },
    {
      id: "dsc-hoyoazul",
      name: "Hoyo Azul & Scape Park",
      category: "Excursion",
      blurb: "A cenote of impossible turquoise at the foot of a cliff in Cap Cana, reached by a short jungle walk. Add zip lines and cave pools if you want a whole day of it.",
      tip: "First entry of the morning gets you the water almost to yourself and much better photographs.",
      walkMinutes: 0,
      priceLevel: "$$$",
      mapUrl: "https://maps.google.com/?q=Hoyo+Azul+Scape+Park+Cap+Cana",
      image: "",
      tags: ["Cenote", "Half day", "Swimming"],
      order: 8
    },
    {
      id: "dsc-macao",
      name: "Playa Macao",
      category: "Excursion",
      blurb: "Twenty-five minutes north, wilder and emptier, with real Atlantic waves and the best beginner surf school on this coast. Fried fish shacks right behind the sand.",
      tip: "The current is genuinely strong here \u2014 swim where the surf school is, not at the empty ends.",
      walkMinutes: 0,
      priceLevel: "$$",
      mapUrl: "https://maps.google.com/?q=Playa+Macao+Punta+Cana",
      image: "",
      tags: ["Surfing", "Wild beach", "Half day"],
      order: 9
    },
    {
      id: "dsc-snorkel",
      name: "The reef off Los Corales",
      category: "Excursion",
      blurb: "You do not need a boat trip to snorkel here. The reef sits a short swim from the shore in front of Los Corales, with parrotfish, sergeant majors and the occasional ray.",
      tip: "Go early \u2014 the water is clearest before the wind picks up around eleven. Bring reef-safe sunscreen.",
      walkMinutes: 3,
      priceLevel: "Free",
      mapUrl: "https://maps.google.com/?q=Los+Corales+reef+snorkeling",
      image: "",
      tags: ["Snorkeling", "Free", "Morning"],
      order: 10
    },
    {
      id: "dsc-cocobongo",
      name: "Coco Bongo",
      category: "Nightlife",
      blurb: "Not a nightclub so much as a three-hour circus \u2014 acrobats on wires, tribute acts, confetti cannons, open bar. Downtown Punta Cana, and completely relentless.",
      tip: "Doors open around 22:00 but the show builds after midnight. Ticket includes drinks, so take a taxi, not a car.",
      walkMinutes: 0,
      priceLevel: "$$$",
      mapUrl: "https://maps.google.com/?q=Coco+Bongo+Punta+Cana",
      image: "",
      tags: ["Show", "Open bar", "Late"],
      order: 11
    },
    {
      id: "dsc-imagine",
      name: "Imagine Punta Cana",
      category: "Nightlife",
      blurb: "A discotheque built inside a natural cave system, with different music in each cavern. Strange and completely brilliant.",
      tip: "Wednesdays and Saturdays are the big nights. Dress code is smart \u2014 no beachwear at the door.",
      walkMinutes: 0,
      priceLevel: "$$$",
      mapUrl: "https://maps.google.com/?q=Imagine+Punta+Cana",
      image: "",
      tags: ["Club", "Caves", "Late"],
      order: 12
    },
    {
      id: "dsc-palmareal",
      name: "Palma Real Shopping Village",
      category: "Shopping",
      blurb: "The nearest proper mall \u2014 pharmacy, supermarket, cigars, rum, amber and larimar, a cinema and a food court. Free shuttles run from most resorts.",
      tip: "Larimar is only mined in the Dominican Republic. Buy it here from a certified shop rather than from a beach vendor.",
      walkMinutes: 0,
      priceLevel: "$$",
      mapUrl: "https://maps.google.com/?q=Palma+Real+Shopping+Village",
      image: "",
      tags: ["Souvenirs", "Pharmacy", "Air conditioning"],
      order: 13
    },
    {
      id: "dsc-supermarket",
      name: "Supermercado in Los Corales",
      category: "Essentials",
      blurb: "Water, rum, coffee, sunscreen and fruit at local prices, five minutes from the beach \u2014 a fraction of what the resort shop charges for the same bottle.",
      tip: "Buy the big 5-litre water bottles. Never drink the tap water, and skip ice from street stalls.",
      walkMinutes: 5,
      priceLevel: "$",
      mapUrl: "https://maps.google.com/?q=supermercado+Los+Corales+Bavaro",
      image: "",
      tags: ["Water", "Snacks", "Cheap"],
      order: 14
    },
    {
      id: "dsc-pharmacy",
      name: "Farmacia & clinic",
      category: "Essentials",
      blurb: "Pharmacies here are excellent and much cheaper than at home \u2014 after-sun, motion sickness tablets, mosquito repellent, most antibiotics over the counter.",
      tip: "For anything more serious, the private clinics in B\xE1varo are fast and speak English. Keep your travel insurance number in your phone.",
      walkMinutes: 6,
      priceLevel: "$",
      mapUrl: "https://maps.google.com/?q=farmacia+Bavaro+Los+Corales",
      image: "",
      tags: ["Health", "After-sun", "Repellent"],
      order: 15
    },
    {
      id: "dsc-money",
      name: "Cash, cards & tipping",
      category: "Essentials",
      blurb: "US dollars are accepted nearly everywhere, but you get a better rate paying in pesos. Cards work in restaurants and shops; beach vendors and motoconchos are cash only.",
      tip: "Withdraw from a bank ATM inside a mall, not a standalone machine on the street. 10% is a normal, appreciated tip.",
      walkMinutes: 5,
      priceLevel: "\u2014",
      mapUrl: "https://maps.google.com/?q=Banco+Popular+Bavaro",
      image: "",
      tags: ["Money", "ATM", "Tipping"],
      order: 16
    },
    {
      id: "dsc-transport",
      name: "Getting around B\xE1varo",
      category: "Getting around",
      blurb: "Uber works in Punta Cana and is the cheapest honest option. Motoconchos (motorbike taxis) are fastest for short hops. Resort taxis are comfortable but priced in dollars.",
      tip: "Agree the price before you get in any taxi or on any motoconcho. Ask your hotel what the fare should be first.",
      walkMinutes: 0,
      priceLevel: "$",
      mapUrl: "https://maps.google.com/?q=Bavaro+Punta+Cana",
      image: "",
      tags: ["Uber", "Taxi", "Motoconcho"],
      order: 17
    },
    {
      id: "dsc-sargassum",
      name: "Sargassum & sun timing",
      category: "Essentials",
      blurb: "Seaweed drifts onto this coast mostly between May and August; crews clear the main beaches each morning. UV is brutal between 11:00 and 15:00 even under cloud.",
      tip: "Swim early, shade in the middle of the day, and book your beach massage for the golden hour instead of noon.",
      walkMinutes: 0,
      priceLevel: "\u2014",
      mapUrl: "",
      image: "",
      tags: ["Weather", "Sun safety", "Planning"],
      order: 18
    }
  ],
  testimonials: [
    {
      id: "tst-1",
      name: "Hannah & Tom",
      country: "United Kingdom",
      quote: "We booked the sunset couples massage on our honeymoon and it turned out to be the thing we talk about most. Two therapists, a tent on the sand, the sky going pink. Worth every dollar.",
      rating: 5,
      service: "Couples Massage",
      stayedAt: "Los Corales",
      order: 1
    },
    {
      id: "tst-2",
      name: "Markus",
      country: "Deutschland",
      quote: "Ich hatte nach dem Flug einen komplett blockierten Nacken. Yaritza hat genau gewusst, wo sie arbeiten muss. Am n\xE4chsten Morgen war alles frei. Ganz klare Empfehlung.",
      rating: 5,
      service: "Deep Tissue",
      stayedAt: "Hotel in B\xE1varo",
      order: 2
    },
    {
      id: "tst-3",
      name: "Sophie",
      country: "Canada",
      quote: "They came to my room at 8pm after the Saona trip, brought everything, and were completely professional from start to finish. As a woman travelling alone I felt entirely comfortable.",
      rating: 5,
      service: "Full Body Relaxing",
      stayedAt: "Resort, B\xE1varo",
      order: 3
    },
    {
      id: "tst-4",
      name: "Familia Restrepo",
      country: "Colombia",
      quote: "Reservamos para cuatro personas por WhatsApp y respondieron en cinco minutos. Puntuales, amables y con muy buenas manos. Volvimos tres veces en una semana.",
      rating: 5,
      service: "Reductive & Relaxing",
      stayedAt: "Villa, Cocotal",
      order: 4
    },
    {
      id: "tst-5",
      name: "Elena",
      country: "Espa\xF1a",
      quote: "Estaba embarazada de siete meses y Carolina lo hizo todo de lado, con cojines, con much\xEDsimo cuidado. Dorm\xED de un tir\xF3n por primera vez en el viaje.",
      rating: 5,
      service: "Prenatal",
      stayedAt: "El Cortecito",
      order: 5
    },
    {
      id: "tst-6",
      name: "Dave",
      country: "United States",
      quote: "Half the price of the resort spa and honestly better. The studio is small and simple but spotlessly clean, and the massage was the real thing. Went back twice.",
      rating: 5,
      service: "Hot Stone",
      stayedAt: "Punta Cana",
      order: 6
    }
  ],
  faqs: [
    {
      id: "faq-book",
      question: "How do I book?",
      answer: "WhatsApp is fastest \u2014 we usually reply within a few minutes between 9:00 and 21:00. Send your dates, how many people, and whether you want the studio, the beach or your room. You can also use the reservation form on this site; it opens WhatsApp with everything already filled in.",
      order: 1
    },
    {
      id: "faq-hotel",
      question: "Can you really come to my hotel room?",
      answer: "Yes \u2014 we visit resorts, hotels, Airbnbs and villas across B\xE1varo, El Cortecito, Cortecito, Cap Cana, Cocotal, Uvero Alto and Punta Cana Village. We bring a folding table, fresh linens, oils, towels and a small speaker. Just tell us the resort name and your building or room number so reception lets us through smoothly.",
      order: 2
    },
    {
      id: "faq-pay",
      question: "How can I pay?",
      answer: "Cash in US dollars or Dominican pesos, card in the studio, or online before we arrive \u2014 we send a Stripe or PayPal link over WhatsApp, and we also accept local transfers and card payments through Banco Popular / Azul. Whatever is easiest for you.",
      order: 3
    },
    {
      id: "faq-safe",
      question: "Is this a legitimate, professional massage service?",
      answer: "Completely. This is a licensed therapeutic massage business run by a woman, staffed entirely by certified Dominican therapists. We offer therapeutic and relaxation massage only. Draping is used at all times and your comfort and privacy are respected without exception.",
      order: 4
    },
    {
      id: "faq-notice",
      question: "How far in advance should I book?",
      answer: "Same-day appointments are often possible, especially in the studio. For sunset beach slots, couples massages and anything for a group, a day or two ahead is much safer \u2014 those hours fill first in high season.",
      order: 5
    },
    {
      id: "faq-bring",
      question: "What do I need to prepare?",
      answer: "Nothing. For hotel visits, just clear a little space beside the bed. Shower first if you have been in the sea \u2014 salt and sand make oil work rough on the skin. Afterwards, drink water and try not to schedule anything demanding for an hour.",
      order: 6
    },
    {
      id: "faq-pressure",
      question: "What if I do not like the pressure?",
      answer: "Tell us immediately, in any language, at any moment. There is no politeness required here \u2014 we adjust straight away. Pressure that you tolerate rather than enjoy is a massage that did not work.",
      order: 7
    },
    {
      id: "faq-group",
      question: "Can you do groups, weddings and bachelorette parties?",
      answer: "Yes, and we love them. For groups we bring two or three therapists so nobody waits long. Give us a few days notice for anything over four people, and tell us the villa or suite so we can plan the setup.",
      order: 8
    }
  ],
  payments: [
    {
      id: "pay-cash",
      name: "Cash",
      description: "US dollars or Dominican pesos, paid after the session. Nothing to arrange in advance.",
      icon: "cash",
      url: "",
      enabled: true,
      order: 1
    },
    {
      id: "pay-stripe",
      name: "Card via Stripe",
      description: "Visa, Mastercard and Amex. We send you a secure Stripe link on WhatsApp \u2014 pay before we arrive or on the table.",
      icon: "stripe",
      url: "",
      enabled: true,
      order: 2
    },
    {
      id: "pay-azul",
      name: "Banco Popular \xB7 Azul",
      description: "Local card payments and transfers through Banco Popular Azul. The easiest option if you have a Dominican account.",
      icon: "bank",
      url: "",
      enabled: true,
      order: 3
    },
    {
      id: "pay-paypal",
      name: "PayPal",
      description: "Send to our PayPal address, or ask us for a payment request. Useful if you would rather not enter a card at all.",
      icon: "paypal",
      url: "",
      enabled: true,
      order: 4
    }
  ],
  gallery: [
    { id: "gal-1", caption: "Sunrise setup on Los Corales beach", image: "", order: 1 },
    { id: "gal-2", caption: "The studio, five minutes before opening", image: "", order: 2 },
    { id: "gal-3", caption: "Warm stones, ready", image: "", order: 3 },
    { id: "gal-4", caption: "Golden hour, two tables", image: "", order: 4 },
    { id: "gal-5", caption: "Coconut oil pressed on the island", image: "", order: 5 },
    { id: "gal-6", caption: "The walk from our door to the sand", image: "", order: 6 }
  ]
};

// ../shared/server.ts
var KV_KEYS = {
  content: "content:v1",
  password: "auth:password",
  session: /* @__PURE__ */ __name((token) => `session:${token}`, "session"),
  booking: /* @__PURE__ */ __name((id) => `booking:${id}`, "booking"),
  loginAttempts: /* @__PURE__ */ __name((ip) => `throttle:login:${ip}`, "loginAttempts")
};
var SESSION_COOKIE = "os_session";
var SESSION_TTL_SECONDS = 60 * 60 * 12;
var DEFAULT_PASSWORD = "massage";
var PBKDF2_ITERATIONS = 15e4;
var encoder = new TextEncoder();
function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
__name(toBase64, "toBase64");
function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
__name(fromBase64, "fromBase64");
async function derive(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return toBase64(new Uint8Array(bits));
}
__name(derive, "derive");
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${hash}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  const [scheme, , saltB64, expected] = stored.split("$");
  if (scheme !== "pbkdf2" || !saltB64 || !expected) return false;
  const actual = await derive(password, fromBase64(saltB64));
  return timingSafeEqual(actual, expected);
}
__name(verifyPassword, "verifyPassword");
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
__name(timingSafeEqual, "timingSafeEqual");
function randomToken() {
  return toBase64(crypto.getRandomValues(new Uint8Array(32))).replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);
}
__name(randomToken, "randomToken");
async function readContent(kv) {
  const raw = await kv.get(KV_KEYS.content, "json");
  if (!raw) {
    await kv.put(KV_KEYS.content, JSON.stringify(seedContent));
    return structuredClone(seedContent);
  }
  return mergeWithSeed(raw);
}
__name(readContent, "readContent");
function mergeWithSeed(stored) {
  const base = structuredClone(seedContent);
  return {
    ...base,
    ...stored,
    site: { ...base.site, ...stored.site ?? {} }
  };
}
__name(mergeWithSeed, "mergeWithSeed");
async function writeContent(kv, content) {
  await kv.put(KV_KEYS.content, JSON.stringify(content));
}
__name(writeContent, "writeContent");
var COLLECTION_KEYS = [
  "services",
  "venues",
  "team",
  "benefits",
  "discover",
  "testimonials",
  "faqs",
  "packages",
  "payments",
  "gallery"
];
function isCollectionKey(value) {
  return COLLECTION_KEYS.includes(value);
}
__name(isCollectionKey, "isCollectionKey");
async function ensurePassword(kv) {
  const existing = await kv.get(KV_KEYS.password);
  if (!existing) await kv.put(KV_KEYS.password, await hashPassword(DEFAULT_PASSWORD));
}
__name(ensurePassword, "ensurePassword");
async function isDefaultPassword(kv) {
  const stored = await kv.get(KV_KEYS.password);
  if (!stored) return true;
  return verifyPassword(DEFAULT_PASSWORD, stored);
}
__name(isDefaultPassword, "isDefaultPassword");
function readCookie(request, name) {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}
__name(readCookie, "readCookie");
function sessionTokenFrom(request) {
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  return readCookie(request, SESSION_COOKIE);
}
__name(sessionTokenFrom, "sessionTokenFrom");
async function isAuthed(request, kv) {
  const token = sessionTokenFrom(request);
  if (!token) return false;
  return await kv.get(KV_KEYS.session(token)) !== null;
}
__name(isAuthed, "isAuthed");
function sessionCookie(token, maxAge, secure) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAge}`
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
__name(sessionCookie, "sessionCookie");
async function checkLoginThrottle(kv, ip) {
  const raw = await kv.get(KV_KEYS.loginAttempts(ip));
  const count3 = raw ? Number(raw) : 0;
  return { blocked: count3 >= 10, remaining: Math.max(0, 10 - count3) };
}
__name(checkLoginThrottle, "checkLoginThrottle");
async function recordFailedLogin(kv, ip) {
  const key = KV_KEYS.loginAttempts(ip);
  const count3 = Number(await kv.get(key) ?? 0) + 1;
  await kv.put(key, String(count3), { expirationTtl: 600 });
}
__name(recordFailedLogin, "recordFailedLogin");
async function clearLoginThrottle(kv, ip) {
  await kv.delete(KV_KEYS.loginAttempts(ip));
}
__name(clearLoginThrottle, "clearLoginThrottle");
async function listBookings(kv) {
  const list = await kv.list({ prefix: "booking:" });
  const rows = await Promise.all(list.keys.map((k) => kv.get(k.name, "json")));
  return rows.filter((b) => Boolean(b)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
__name(listBookings, "listBookings");
function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...init.headers ?? {}
    }
  });
}
__name(json, "json");
function fail(status, message) {
  return json({ error: message }, { status });
}
__name(fail, "fail");
function clean(value, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
__name(clean, "clean");

// api/[[route]].ts
var onRequest = /* @__PURE__ */ __name(async (context2) => {
  const { request, env: env2, params } = context2;
  const kv = env2.CONTENT;
  if (!kv) return fail(500, "KV namespace CONTENT is not bound. Check wrangler.toml.");
  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : [];
  const path = segments.join("/");
  const method = request.method.toUpperCase();
  const secure = new URL(request.url).protocol === "https:";
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (method === "OPTIONS") return new Response(null, { status: 204 });
  try {
    if (path === "content" && method === "GET") {
      return json(await readContent(kv));
    }
    if (path === "bookings" && method === "POST") {
      const body = await request.json().catch(() => ({}));
      const name = clean(body.name, 120);
      const contact = clean(body.contact, 160);
      if (!name || !contact) return fail(400, "Name and a way to reach you are both required.");
      const booking = {
        id: `${Date.now()}-${randomToken().slice(0, 8)}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        name,
        contact,
        service: clean(body.service, 160),
        duration: clean(body.duration, 60),
        venue: clean(body.venue, 160),
        date: clean(body.date, 40),
        time: clean(body.time, 40),
        people: clean(body.people, 40),
        hotel: clean(body.hotel, 200),
        notes: clean(body.notes, 1500),
        status: "new"
      };
      await kv.put(KV_KEYS.booking(booking.id), JSON.stringify(booking), {
        expirationTtl: 60 * 60 * 24 * 180
      });
      return json({ ok: true, id: booking.id }, { status: 201 });
    }
    if (path === "admin/login" && method === "POST") {
      await ensurePassword(kv);
      const throttle = await checkLoginThrottle(kv, ip);
      if (throttle.blocked) return fail(429, "Too many attempts. Wait ten minutes and try again.");
      const body = await request.json().catch(() => ({}));
      const stored = await kv.get(KV_KEYS.password) ?? "";
      const ok = await verifyPassword(body.password ?? "", stored);
      if (!ok) {
        await recordFailedLogin(kv, ip);
        const left = (await checkLoginThrottle(kv, ip)).remaining;
        return fail(401, left > 0 ? `Wrong password. ${left} attempts left.` : "Wrong password.");
      }
      await clearLoginThrottle(kv, ip);
      const token = randomToken();
      await kv.put(KV_KEYS.session(token), JSON.stringify({ ip, at: Date.now() }), {
        expirationTtl: SESSION_TTL_SECONDS
      });
      return json(
        { ok: true, usingDefaultPassword: await isDefaultPassword(kv) },
        { headers: { "Set-Cookie": sessionCookie(token, SESSION_TTL_SECONDS, secure) } }
      );
    }
    if (path === "admin/logout" && method === "POST") {
      const token = sessionTokenFrom(request);
      if (token) await kv.delete(KV_KEYS.session(token));
      return json({ ok: true }, { headers: { "Set-Cookie": sessionCookie("", 0, secure) } });
    }
    if (path === "admin/me" && method === "GET") {
      await ensurePassword(kv);
      const authed = await isAuthed(request, kv);
      return json({ authed, usingDefaultPassword: authed ? await isDefaultPassword(kv) : false });
    }
    if (path.startsWith("admin/")) {
      if (!await isAuthed(request, kv)) return fail(401, "Not signed in.");
    } else {
      return fail(404, "Unknown endpoint.");
    }
    if (path === "admin/content" && method === "GET") {
      return json(await readContent(kv));
    }
    if (path === "admin/content" && method === "PUT") {
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== "object") return fail(400, "Invalid content payload.");
      const current = await readContent(kv);
      await writeContent(kv, { ...current, ...body, site: { ...current.site, ...body.site ?? {} } });
      return json({ ok: true });
    }
    if (path === "admin/settings" && method === "PUT") {
      const body = await request.json().catch(() => null);
      if (!body) return fail(400, "Invalid settings payload.");
      const current = await readContent(kv);
      await writeContent(kv, { ...current, site: { ...current.site, ...body } });
      return json({ ok: true });
    }
    if (path.startsWith("admin/collection/") && method === "PUT") {
      const key = path.slice("admin/collection/".length);
      if (!isCollectionKey(key)) return fail(400, `Unknown collection "${key}".`);
      const body = await request.json().catch(() => null);
      if (!Array.isArray(body)) return fail(400, "Expected an array of records.");
      const current = await readContent(kv);
      await writeContent(kv, { ...current, [key]: body });
      return json({ ok: true, count: body.length });
    }
    if (path === "admin/password" && method === "POST") {
      const body = await request.json().catch(() => ({}));
      const stored = await kv.get(KV_KEYS.password) ?? "";
      if (!await verifyPassword(body.current ?? "", stored)) return fail(403, "Current password is not correct.");
      const next = (body.next ?? "").trim();
      if (next.length < 4) return fail(400, "Choose a password of at least 4 characters.");
      await kv.put(KV_KEYS.password, await hashPassword(next));
      return json({ ok: true, usingDefaultPassword: next === DEFAULT_PASSWORD });
    }
    if (path === "admin/bookings" && method === "GET") {
      return json(await listBookings(kv));
    }
    if (path.startsWith("admin/bookings/")) {
      const id = path.slice("admin/bookings/".length);
      const key = KV_KEYS.booking(id);
      if (method === "DELETE") {
        await kv.delete(key);
        return json({ ok: true });
      }
      if (method === "PATCH") {
        const existing = await kv.get(key, "json");
        if (!existing) return fail(404, "Booking not found.");
        const body = await request.json().catch(() => ({}));
        const updated = { ...existing, ...body, id: existing.id, createdAt: existing.createdAt };
        await kv.put(key, JSON.stringify(updated), { expirationTtl: 60 * 60 * 24 * 180 });
        return json({ ok: true, booking: updated });
      }
    }
    if (path === "admin/reset" && method === "POST") {
      const body = await request.json().catch(() => ({}));
      const section = body.section ?? "all";
      if (section === "all") {
        await writeContent(kv, structuredClone(seedContent));
        return json({ ok: true, section });
      }
      if (section === "site") {
        const current = await readContent(kv);
        await writeContent(kv, { ...current, site: structuredClone(seedContent.site) });
        return json({ ok: true, section });
      }
      if (isCollectionKey(section)) {
        const current = await readContent(kv);
        await writeContent(kv, { ...current, [section]: structuredClone(seedContent[section]) });
        return json({ ok: true, section });
      }
      return fail(400, `Cannot reset "${section}".`);
    }
    return fail(404, "Unknown endpoint.");
  } catch (error3) {
    const message = error3 instanceof Error ? error3.message : "Unexpected error";
    return fail(500, message);
  }
}, "onRequest");

// robots.txt.ts
var onRequestGet = /* @__PURE__ */ __name(({ request }) => {
  const origin = new URL(request.url).origin;
  return new Response(
    ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "", `Sitemap: ${origin}/sitemap.xml`, ""].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } }
  );
}, "onRequestGet");

// sitemap.xml.ts
var PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/treatments", priority: "0.9", changefreq: "weekly" },
  { path: "/discover", priority: "0.8", changefreq: "monthly" },
  { path: "/team", priority: "0.7", changefreq: "monthly" },
  { path: "/book", priority: "0.9", changefreq: "monthly" }
];
var onRequestGet2 = /* @__PURE__ */ __name(({ request }) => {
  const origin = new URL(request.url).origin;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const urls = PAGES.map(
    (page) => `  <url>
    <loc>${origin}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }
  );
}, "onRequestGet");

// ../.wrangler/tmp/pages-xnmY4N/functionsRoutes-0.5010333894554552.mjs
var routes = [
  {
    routePath: "/api/:route*",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/robots.txt",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/sitemap.xml",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
