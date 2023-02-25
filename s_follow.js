class S_turn {
  id;
  gDeviation = 0;
  yDeviation=0;
  xDeviation=0;
  gMulFactor = 1;

  yOffset= 0
  xOffset= 0
  excludeWithS_fex= []
  followOnHoveringElement = "body";
  returnWhenHoveringExcluded = {
    on: false,
    includeRotation: false,
    includeOrigin: true,
    transitionTime: 0,
  };
  // xOffset = 0;
  // yOffset = 0;
  #eHoverings_fex = "";
  //pròpies a for each
  //this[this.id + "elements_excluded" + i] // boolean //default: false
  //this[this.id + "excluded" + i] // array of classes // default []
  //this[this.id + "cursorOut" + i] boolean // definit a fals
  //this[this.id + "CenterY_var" + i] number
  //this[this.id + "CenterX_var" + i] number
  // this[this.id + "CenterX_var_Comp" + i] =0;
  // this[this.id + "CenterY_var_Comp" + i] =0;
  //this[this.id + "abortController"] new AbortControler // controla els events i els pot abortar per sempre amb stop.
  //this[this.id + "runningController"] boolean // controla els events i els pot pausar i remprendre  amb pause,resume.
  constructor(id, options = null) {
    if (id.length < 1) {
      throw new Error("Selector is mandatory!");
    }
    this.id = id;
    let element = document.querySelectorAll(this.id);
    ///////////////////////////OPTIONS
    if (options) {
      options.xOffset && (this.xOffset = options.xOffset);
      options.yOffset && (this.yOffset = options.yOffset);
      options.yDeviation && (this.yDeviation = options.yDeviation);
      options.xDeviation && (this.xDeviation = options.xDeviation);
      options.gDeviation && (this.gDeviation = options.gDeviation);
      options.gMulFactor && (this.gMulFactor = options.gMulFactor);
      options.followOnHoveringElement && (this.followOnHoveringElement = options.followOnHoveringElement);
      options.returnWhenHoveringExcluded && (this.returnWhenHoveringExcluded = options.returnWhenHoveringExcluded);
    }
    element.forEach((e, i) => {
      this[this.id + "CenterX_var_Comp" + i] =0;
      this[this.id + "CenterY_var_Comp" + i] =0;
      if (options) {
       if(options.xOffsetCompensation) this[this.id + "CenterX_var_Comp" + i] = options.xOffsetCompensation;
       if(options.yOffsetCompensation) this[this.id + "CenterY_var_Comp" + i] = options.yOffsetCompensation;
        this[this.id + "elements_excluded" + i] = false;
        this[this.id + "excluded" + i] = [];
        if (options.excludeWithS_fex) {
          this[this.id + "excluded" + i] = options.excludeWithS_fex;
          this[this.id + "elements_excluded" + i] = true;
          this[this.id + "cursorOut" + i];
        }
      }
      this.#position(e, i);
    });

    this.rotateStart = (ev) => this.#followStart(ev);
    this.eventListenerFunction = this.rotateStart.bind(this);
    this[this.id + "abortController"] = new AbortController();
    this[this.id + "runningController"] = true;
    document
      .querySelector(this.followOnHoveringElement)
      .addEventListener("mousemove", this.eventListenerFunction, { signal: this[this.id + "abortController"].signal });
    document
      .querySelector(this.followOnHoveringElement)
      .addEventListener("touchmove", this.eventListenerFunction, { signal: this[this.id + "abortController"].signal });
  }

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

  #followStart(ev) {
    //console.log(ev.target.attributes.s_fex.value);
    let element = document.querySelectorAll(this.id);
    this.#eHoverings_fex = ev.target.attributes.s_fex?.value; // '?' hi ha s_flex? si no no ho pillis
    element.forEach((e, i) => {
      if (this[this.id + "runningController"]) {
        if (this[this.id + "excluded" + i]?.some((e) => e === this.#eHoverings_fex)) {
          // si el cursor pasa per un exclude
          this[this.id + "cursorOut" + i] = true;
        } else {
          this[this.id + "cursorOut" + i] = false;
        }
        if (typeof this[this.id + "doItOnce" + i] === "undefined") {
          this[this.id + "doItOnce" + i] = false;
        }
        if (!this[this.id + "cursorOut" + i] || !this[this.id + "elements_excluded" + i]) {
          let ySum = this.yOffset === 0 ? 0 : this.yOffset > 0 ? 180 : 0;
          let xSum = this.xOffset === 0 ? 0 : this.xOffset > 0 ? 270 : 90;
          let rad = Math.atan2(ev.clientX - (this[this.id + "CenterX_var" + i] - this[this.id + "CenterX_var_Comp" + i]), ev.clientY - (this[this.id + "CenterY_var" + i] - this[this.id + "CenterY_var_Comp" + i]));
          let rotation = (((rad * (180 / Math.PI) * -1 + (this.yOffset === 0 ? (xSum)+ this.xDeviation : (ySum) + this.yDeviation )) + this.gDeviation) * this.gMulFactor);
          e.style.transform = "rotate(" + rotation + "deg)";
        }
        if (this.returnWhenHoveringExcluded.on) {
          // si la opció returnWhenOut està activat
          if (this[this.id + "cursorOut" + i] & !this[this.id + "doItOnce" + i]) {
            //si el custor entra en un exclude
            this[this.id + "doItOnce" + i] = true;
            e.style.transitionProperty = "transform,transform-origin,top,left";
            e.style.transitionDuration = this.returnWhenHoveringExcluded.transitionTime + "s";
            if (this.returnWhenHoveringExcluded.includeRotation) e.style.transform = "rotate(0deg)"; // si inclou el rotate
            if (this.returnWhenHoveringExcluded.includeOrigin) {
              e.style.transformOrigin = "50% 50%";
              e.style.top = "0";
              e.style.left = "0";
            }
          }
          if (!this[this.id + "cursorOut" + i] & this[this.id + "doItOnce" + i]) {
            this[this.id + "doItOnce" + i] = false;
            this.#position(e);
            setTimeout(() => {
              e.style.transitionDuration = "0s";
            }, this.returnWhenHoveringExcluded.transitionTime + 100);
          }
        }
      }
    });
  }
  pause(ret=false) {
    console.log(this);
    // if (ret) {
    //   e.style.transitionProperty = "transform,transform-origin,top,left";
    //   e.style.transitionDuration = this.returnWhenHoveringExcluded.transitionTime + "s";
    //   if (this.returnWhenHoveringExcluded.includeRotation) e.style.transform = "rotate(0deg)"; // si inclou el rotate
    //   if (this.returnWhenHoveringExcluded.includeOrigin) {
    //     e.style.transformOrigin = "50% 50%";
    //     e.style.top = "0";
    //     e.style.left = "0";
    //   }
    // }
    this[this.id + "runningController"] = false;
  }
  resume(ret=false) {
    this[this.id + "runningController"] = true;
  }
  stop() {
    // document.querySelector(this.followOnHoveringElement).removeEventListener("pointermove", this.eventListenerFunction);
    this[this.id + "abortController"].abort();
  }
}
