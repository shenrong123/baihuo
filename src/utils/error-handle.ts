import Vue from 'vue';
import iView from 'iview';
const ivu: any = iView;
/**
 * 错误收集及消息弹框提示
 */
class ErrorHandle {
  /**
   * 显示消息
   * @param code  消息code
   * @param msg   消息文本
   * @param option {
   *     type: 消息类型--> warning, error, info
   *     duration: 消息显示时长 --> 单位 (秒)
   * }
   */
  public static showMsg(code: string | number, msg: string, option?: any): void {
    // 消息中的占位符替换,消息格式如：xxx#{user_name}xxx,option中则有{user_name: 'hzb'},结果如：xxxhzbxxx
    const msgKeys: any = msg?msg.match(/#{[a-zA-Z0-9]+}/g):'';
    if (msgKeys && option) {
      msgKeys.forEach((key: string) => {
        const keys = key.substr(2, key.length - 1);
        msg = msg.replace(new RegExp('#{' + keys + '}'), option[keys]);
      });
    }

    const message = Object.assign(
      {},
      {
        coe: code,
        message: msg,
        type: option ? option.type || 'warning' : 'warning',
        duration: option ? option.duration || this.duration : this.duration,
      }
    );

    const msgIndex = this.messages.indexOf(message);
    if (msgIndex < 0) {
      this.messages.push(message);
    } else {
      this.messages[msgIndex] = message;
    }
    if (!this.isShowMessage) {
      this.alertMessage();
    }
  }

  /**
   * 前端错误日志收集
   */
  public static registHandler(): void {
    // Vue全局错误处理对象
    Vue.config.errorHandler = (err: Error, vm?: Vue, info?: string): void => {
      console.error('error:', err, this.generateComponentTrace(vm), info);
    };
    // Window全局错误处理对象，跨域js错误需要添加js的crossorigin属性
    window.onerror = (msg, url, lineNo, columnNo, error): void => {
      console.error('error:', msg, url, lineNo, columnNo, error);
    };
    // 捕获Promise未catch的错误处理对象
    window.addEventListener('unhandledrejection', event => {
      console.error('error:' + event.reason);
    });
  }
  private static isShowMessage: boolean = false;
  // 消息队列
  private static messages: any[] = [];
  private static readonly duration: number = 3;

  /**
   * 从消息队列中取消息逐条显示
   */
  private static alertMessage(): void {
    const alert = (): void => {
      const message: any = this.messages[0];
      ivu.Message[message.type]({
        content: message.message,
        duration: message.duration,
      });
      this.messages.splice(0, 1);
      setTimeout(() => {
        if (this.messages && this.messages.length > 0) {
          alert();
        } else {
          this.isShowMessage = false;
        }
      }, message.duration * 1100);
    };
    if (this.messages && this.messages.length > 0) {
      this.isShowMessage = true;
      alert();
    }
  }
  private static generateComponentTrace(vm: any): string {
    if (vm._isVue && vm.$parent) {
      const tree: any = [];
      let currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          const last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return (
        '\n\nfound in\n\n' +
        tree
          .map((vm: any, i: any) => {
            return (
              '' +
              (i === 0 ? '---> ' : this.repeat(' ', 5 + i * 2)) +
              (Array.isArray(vm)
                ? this.formatComponentName(vm[0]) + '... (' + vm[1] + ' recursive calls)'
                : this.formatComponentName(vm))
            );
          })
          .join('\n')
      );
    }
    return '\n\n(found in ' + this.formatComponentName(vm) + ')';
  }
  private static formatComponentName(vm: any, includeFile?: any): string {
    if (vm.$root === vm) {
      return '<Root>';
    }
    const options =
      typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }
    return (
      (name
        ? '<' +
          name.replace(/(?:^|[-_])(\w)/g, (c: string) => c.toUpperCase()).replace(/[-_]/g, '') +
          '>'
        : '<Anonymous>') + (file && includeFile !== false ? ' at ' + file : '')
    );
  }
  private static repeat(str: string, n: number): string {
    let res = '';
    while (n) {
      if (n % 2 === 1) {
        res += str;
      }
      if (n > 1) {
        str += str;
      }
      n >>= 1;
    }
    return str;
  }
}

export default ErrorHandle;
