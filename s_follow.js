class S_turn {
  selector;
  degreeRange;
  logImportant = false;
  yOffset = 0;
  yDeviation = 0;
  xOffset = 0;
  xDeviation = 0;
  followDeacceleration = 1;
  gDeviation = 0;
  gMulFactor = 1;
  excludeWithS_fex = [];
  followOnHoveringElement = "body";
  easyReturn = {
    on: false,
    includeRotation: false,
    includeOrigin: true,
    transitionTime: 0,
    tFunction: "linear",
  };
  #areElementsExluded = false;
  isCursorInactive;
  isCursorOut = false;
  runningControler = true;
  eInside = true;
  //pròpies a for each
  //this["elements_excluded" + i] // boolean //default: false
  //this["CenterY_var" + i] number  //= Math.round(e.getBoundingClientRect().top + e.clientHeight / 2);
  //this["CenterX_var" + i] number  //= Math.round(e.getBoundingClientRect().left + e.clientWidth / 2);
  //this["CenterX_var_Comp" + i] =0; // compensació del centre pel offset
  //this["CenterY_var_Comp" + i] =0; // compensació del centre pel offset
  //this["abortController"] new AbortControler // controla els events i els pot abortar per sempre amb stop.
  //this["retWhenHoverTimeout" + i]; function timeout // controla el timeout de sortida d'un element exclòs
  //this["retPauseResumeTimeout" + i] // function timeout // controla el timeout de sortida d'un element quan pause resume

  constructor(selector, options = null) {
    // `[data-name*="funnel-chart-percent"]`
    if (selector.length < 1) {
      throw new Error("Selector is mandatory!");
    }
    this.selector = `[S_f*="${selector}"]`;
    ///////////////////////////OPTIONS
    this.#optionsAsignation(options);
    this.rotateStart = (ev) => this.#followStart(ev);
    this.eventListenerFunction = this.rotateStart.bind(this);
    this["abortController"] = new AbortController();
    if (this.detectWindowLeaveEnter) {
    }
    document
      .querySelector(this.followOnHoveringElement)
      .addEventListener("pointermove", this.eventListenerFunction, { signal: this["abortController"].signal });

    this.resize = () => this.#resize();
    this.resizeFunction = this.resize.bind(this);
    window.addEventListener("resize", this.resizeFunction);
    window.addEventListener("scroll", this.resizeFunction);
    // console.log(this);
  }
  #resize() {
    console.log('a');
    document.querySelectorAll(this.selector).forEach((e, i) => {
      this.#position(e, i);
    });
  }
  #optionsAsignation = (options) => {
    if (options) {
      options.degreeRange && (this.degreeRange = options.degreeRange);
      options.xOffset && (this.xOffset = options.xOffset);
      options.yOffset && (this.yOffset = options.yOffset);
      options.yDeviation && (this.yDeviation = options.yDeviation);
      options.xDeviation && (this.xDeviation = options.xDeviation);
      options.gDeviation && (this.gDeviation = options.gDeviation);
      options.gMulFactor && (this.gMulFactor = options.gMulFactor);
      options.followOnHoveringElement && (this.followOnHoveringElement = options.followOnHoveringElement);
      options.easyReturn && (this.easyReturn = options.easyReturn);
      options.followDeacceleration && (this.followDeacceleration = options.followDeacceleration);
      if (options.excludeWithS_fex) {
        this.excludeWithS_fex = options.excludeWithS_fex;
        this.#areElementsExluded = true;
      }
    }
    let element = document.querySelectorAll(this.selector);
    element.forEach((e, i) => {
      if (i !== undefined) {
        this["CenterX_var_Comp" + i] = 0;
        this["CenterY_var_Comp" + i] = 0;
      }
      if (options) {
        if (options.xOffsetCompensation) this["CenterX_var_Comp" + i] = options.xOffsetCompensation;
        if (options.yOffsetCompensation) this["CenterY_var_Comp" + i] = options.yOffsetCompensation;
      }
      this.#position(e, i);
    });
  };
  #position = (e, i) => {
    let xOffset = this.xOffset === 0 ? "50%" : e.clientWidth / 2 + this.xOffset;
    let xUnit = this.xOffset === 0 ? "" : "px";
    let yOffset = this.yOffset === 0 ? "50%" : e.clientHeight / 2 + this.yOffset;
    let yUnit = this.yOffset === 0 ? "" : "px";
    let trOr = xOffset + xUnit + " " + yOffset + yUnit;
    e.style.transformOrigin = trOr;
    if (this.yOffset != 0) e.style.top = this.yOffset * -1 + "px";
    if (this.xOffset != 0) e.style.left = this.xOffset * -1 + "px";
    this["CenterY_var" + i] = Math.round(e.getBoundingClientRect().top + e.clientHeight / 2);
    this["CenterX_var" + i] = Math.round(e.getBoundingClientRect().left + e.clientWidth / 2);
  };

  #followStart(event) {
    const coEvt = event.getCoalescedEvents();
    const hovering_excluded = event.target.attributes.s_fex?.value; // '?' hi ha s_flex? si no no ho pillis
    const elements = document.querySelectorAll(this.selector);
    this.isCursorInactive = this.excludeWithS_fex?.some((e) => e === hovering_excluded) ? true : false;
    const followState = !this.isCursorInactive || !this.#areElementsExluded ? "active" : "inactive"; // o no hi ha excludes o esà fora dels excludes
    if (this.runningControler) {
      elements.forEach((e, i) => {
        this["doItOnce" + i] === "undefined" && (this["doItOnce" + i] = false);
        if (followState === "active" && this.eInside) {
          if (!this["event_count" + i]) {
            this["event_count" + i] = 0;
          }
          for (let ev of coEvt) {
            this["event_count" + i]++;
            if (this["event_count" + i] % this.followDeacceleration === 0) {
              let ySum = this.yOffset === 0 ? 0 : this.yOffset > 0 ? 180 : 0;
              let xSum = this.xOffset === 0 ? 0 : this.xOffset > 0 ? 270 : 90;
              let rad = Math.atan2(
                ev.clientX - (this["CenterX_var" + i] - this["CenterX_var_Comp" + i]),
                ev.clientY - (this["CenterY_var" + i] - this["CenterY_var_Comp" + i])
              );
              let rotation =
                (rad * (180 / Math.PI) * -1 + (this.yOffset === 0 ? xSum + this.xDeviation : ySum + this.yDeviation) + this.gDeviation) * this.gMulFactor;
              if (this.degreeRange && (rotation > this.degreeRange[0] && rotation < this.degreeRange[1])) {
                e.style.transform = "rotate(" + rotation + "deg)";
              } else if(!this.degreeRange){
                e.style.transform = "rotate(" + rotation + "deg)";
              }
            }
          }
        }
        if (this.easyReturn) {
          if (!this.isCursorInactive) {
            while (this["doItOnce" + i]) {
              this["doItOnce" + i] = false;
              this.#position(e);
              this["retWhenHoverTimeout" + i] = setTimeout(() => {
                this.#resume(e);
              }, this.easyReturn.transitionTime * 1000 + 100);
            }
          } else {
            while (!this["doItOnce" + i]) {
              this["doItOnce" + i] = true;
              clearTimeout(this["retWhenHoverTimeout" + i]);
              this.#pause(e);
            }
          }
        }
      });
    }
  }
  pause(ret = false) {
    if (ret) {
      const element = document.querySelectorAll(this.selector);
      element.forEach((e, i) => {
        clearTimeout(this["retPauseResumeTimeout" + i]);
        this.#pause(e);
      });
    }
    this.runningControler = false; //eventRunning
  }
  #pause(e) {
    e.style.transitionTimingFunction = this.easyReturn.tFunction;
    e.style.transitionProperty = "transform,transform-origin,top,left";
    e.style.transitionDuration = this.easyReturn.transitionTime + "s";
    if (this.easyReturn.includeRotation) e.style.transform = "rotate(0deg)"; // si inclou el rotate
    if (this.easyReturn.includeOrigin) {
      e.style.transformOrigin = "50% 50%";
      e.style.top = "0";
      e.style.left = "0";
    }
  }
  resume(ret = false) {
    const element = document.querySelectorAll(this.selector);
    element.forEach((e, i) => {
      if (ret) {
        this.runningControler = true; //eventRunning
        this.#position(e);
        this["retPauseResumeTimeout" + i] = setTimeout(() => {
          this.#resume(e);
        }, this.easyReturn.transitionTime * 1000 + 100);
      } else {
        this.#resume(e);
        this.#position(e);
        this.runningControler = true; //eventRunning
      }
    });
  }
  #resume(e) {
    e.style.transitionProperty = null;
    e.style.transitionDuration = null;
    e.style.transitionTimingFunction = null;
  }
  stop() {
    this["abortController"].abort();
  }

  update(options) {
    this.#optionsAsignation(options);
  }
}
