class S_turn {
  id;
  yOffset = 0;
  yDeviation = 0;
  xOffset = 0;
  xDeviation = 0;
  followDeacceleration = 1;
  gDeviation = 0;
  gMulFactor = 1;
  excludeWithS_fex = [];
  followOnHoveringElement = "body";
  returnWhenHoveringExcluded = {
    on: false,
    includeRotation: false,
    includeOrigin: true,
    transitionTime: 0,
  };
  #eHoverings_fex;

  //TODO: options action: // detect out window i enter window i icluir-lo en exclude
  //pròpies a for each
  //this[this.id + "elements_excluded" + i] // boolean //default: false
  //this[this.id + "excluded" + i] // array of classes // default []
  //this[this.id + "cursorOut" + i] boolean // definit a fals
  //this[this.id + "CenterY_var" + i] number  //= Math.round(e.getBoundingClientRect().top + e.clientHeight / 2);
  //this[this.id + "CenterX_var" + i] number  //= Math.round(e.getBoundingClientRect().left + e.clientWidth / 2);
  //this[this.id + "CenterX_var_Comp" + i] =0; // compensació del centre pel offset
  //this[this.id + "CenterY_var_Comp" + i] =0; // compensació del centre pel offset
  //this[this.id + "abortController"] new AbortControler // controla els events i els pot abortar per sempre amb stop.
  //this[this.id + "runningController"] boolean // controla els events i els pot pausar i remprendre  amb pause,resume.
  //this[this.id + "retWhenHoverTimeout" + i]; function timeout // controla el timeout de sortida d'un element exclòs
  //this[this.id + "retPauseResumeTimeout" + i] // function timeout // controla el timeout de sortida d'un element quan pause resume

  constructor(id, options = null) {
    if (id.length < 1) {
      throw new Error("Selector is mandatory!");
    }
    this.id = id;
    ///////////////////////////OPTIONS
    this.#optionsAsignation(options);
    this.rotateStart = (ev) => this.#followStart(ev);
    this.eventListenerFunction = this.rotateStart.bind(this);
    this[this.id + "abortController"] = new AbortController();
    this[this.id + "runningController"] = true;
    document
    .querySelector(this.followOnHoveringElement)
    .addEventListener("pointermove", this.eventListenerFunction, { signal: this[this.id + "abortController"].signal });

    this.resize = () => this.#resize();
    this.resizeFunction = this.resize.bind(this);
    window.addEventListener("resize",this.resizeFunction);
  }
  #resize(){
    document.querySelectorAll(this.id).forEach((e,i) => {
      this.#position(e, i);
    });
  }
  #optionsAsignation = (options) => {
    if (options) {
      options.xOffset && (this.xOffset = options.xOffset);
      options.yOffset && (this.yOffset = options.yOffset);
      options.yDeviation && (this.yDeviation = options.yDeviation);
      options.xDeviation && (this.xDeviation = options.xDeviation);
      options.gDeviation && (this.gDeviation = options.gDeviation);
      options.gMulFactor && (this.gMulFactor = options.gMulFactor);
      options.followOnHoveringElement && (this.followOnHoveringElement = options.followOnHoveringElement);
      options.returnWhenHoveringExcluded && (this.returnWhenHoveringExcluded = options.returnWhenHoveringExcluded);
      options.followDeacceleration && (this.followDeacceleration = options.followDeacceleration);
    }
    let element = document.querySelectorAll(this.id);
    element.forEach((e, i) => {
      this[this.id + "CenterX_var_Comp" + i] = 0;
      this[this.id + "CenterY_var_Comp" + i] = 0;
      if (options) {
        if (options.xOffsetCompensation) this[this.id + "CenterX_var_Comp" + i] = options.xOffsetCompensation;
        if (options.yOffsetCompensation) this[this.id + "CenterY_var_Comp" + i] = options.yOffsetCompensation;
        if (options.excludeWithS_fex) {
          this[this.id + "excluded" + i] = options.excludeWithS_fex;
          this[this.id + "elements_excluded" + i] = true;
          this[this.id + "cursorOut" + i];
        }
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
    this[this.id + "CenterY_var" + i] = Math.round(e.getBoundingClientRect().top + e.clientHeight / 2);
    this[this.id + "CenterX_var" + i] = Math.round(e.getBoundingClientRect().left + e.clientWidth / 2);
  };

  #followStart(event) {
    this[this.id + "event"] = event.getCoalescedEvents();
    this.#eHoverings_fex = event.target.attributes.s_fex?.value; // '?' hi ha s_flex? si no no ho pillis
    document.querySelectorAll(this.id).forEach((e, i) => {
      let eventRunning = this[this.id + "runningController"];
      if (eventRunning) {
        this[this.id + "cursorOut" + i] = this[this.id + "excluded" + i]?.some((e) => e === this.#eHoverings_fex) ? true : false;
        let cursorOutOfInfluence = this[this.id + "cursorOut" + i];

        if (typeof this[this.id + "doItOnce" + i] === "undefined") this[this.id + "doItOnce" + i] = false;

        let followState = !cursorOutOfInfluence || !this[this.id + "elements_excluded" + i] ? "active" : "inactive";
        if (followState === "active") {
          /// moviment general amb possibilitat de controlar la frequencia del trigger depenent del followDeacceleration.
          if (!this[this.id + "event_count" + i]) {
            this[this.id + "event_count" + i] = 0;

          }
          for (let ev of this[this.id + "event"]) {
            this[this.id + "event_count" + i]++;
            if (this[this.id + "event_count" + i] % this.followDeacceleration === 0) {
              let ySum = this.yOffset === 0 ? 0 : this.yOffset > 0 ? 180 : 0;
              let xSum = this.xOffset === 0 ? 0 : this.xOffset > 0 ? 270 : 90;
              let rad = Math.atan2(
                ev.clientX - (this[this.id + "CenterX_var" + i] - this[this.id + "CenterX_var_Comp" + i]),
                ev.clientY - (this[this.id + "CenterY_var" + i] - this[this.id + "CenterY_var_Comp" + i])
              );
              let rotation =
                (rad * (180 / Math.PI) * -1 + (this.yOffset === 0 ? xSum + this.xDeviation : ySum + this.yDeviation) + this.gDeviation) * this.gMulFactor;
              e.style.transform = "rotate(" + rotation + "deg)";
            }
          }
        }

        if (this.returnWhenHoveringExcluded.on) {
          // si la opció returnWhenOut està activat
          if (cursorOutOfInfluence & !this[this.id + "doItOnce" + i]) {
            !this[this.id + "retWhenHoverTimeout" + i] && this[this.id + "retWhenHoverTimeout" + i];
            clearTimeout(this[this.id + "retWhenHoverTimeout" + i]);

            e.style.transitionProperty = "transform,transform-origin,top,left";
            e.style.transitionDuration = this.returnWhenHoveringExcluded.transitionTime + "s";
            if (this.returnWhenHoveringExcluded.includeRotation) e.style.transform = "rotate(0deg)"; // si inclou el rotate
            if (this.returnWhenHoveringExcluded.includeOrigin) {
              e.style.transformOrigin = "50% 50%";
              e.style.top = "0";
              e.style.left = "0";
            }
            this[this.id + "doItOnce" + i] = true;
          } else if (!cursorOutOfInfluence & this[this.id + "doItOnce" + i]) {
            //si el custor surt d' un exclude
            this[this.id + "doItOnce" + i] = false;
            this.#position(e);
            this[this.id + "retWhenHoverTimeout" + i] = setTimeout(() => {
              e.style.transitionProperty = null;
              e.style.transitionDuration = null;
            }, this.returnWhenHoveringExcluded.transitionTime * 1000 + 100);
          }
        }
      }
    });
  }
  pause(ret = false) {
    if (ret) {
      let element = document.querySelectorAll(this.id);
      element.forEach((e, i) => {
        if (!this[this.id + "retPauseResumeTimeout" + i]) {
          this[this.id + "retPauseResumeTimeout" + i];
        }
        clearTimeout(this[this.id + "retPauseResumeTimeout" + i]);
        e.style.transitionProperty = "transform,transform-origin,top,left";
        e.style.transitionDuration = this.returnWhenHoveringExcluded.transitionTime + "s";
        if (this.returnWhenHoveringExcluded.includeRotation) e.style.transform = "rotate(0deg)"; // si inclou el rotate
        if (this.returnWhenHoveringExcluded.includeOrigin) {
          e.style.transformOrigin = "50% 50%";
          e.style.top = "0";
          e.style.left = "0";
        }
      });
    }

    this[this.id + "runningController"] = false; //eventRunning
  }
  resume(ret = false) {
    let element = document.querySelectorAll(this.id);
    element.forEach((e, i) => {
      if (ret) {
        this[this.id + "runningController"] = true; //eventRunning
        this.#position(e);
        this[this.id + "retPauseResumeTimeout" + i] = setTimeout(() => {
          e.style.transitionProperty = null;
          e.style.transitionDuration = null;
        }, this.returnWhenHoveringExcluded.transitionTime * 1000 + 100);
      } else {
        e.style.transitionProperty = null;
        e.style.transitionDuration = null;
        this.#position(e);
        this[this.id + "runningController"] = true; //eventRunning
      }
    });
  }
  stop() {
    this[this.id + "abortController"].abort();
  }

  update(options) {
    this.#optionsAsignation(options);
  }
}
