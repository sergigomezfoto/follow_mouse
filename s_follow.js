class S_turn {
  id;
  squinting = 0;
  followOnHoveringElement = "body";
  returnWhenHoveringExcluded = {
    on: false,
    includeRotation: false,
    transitionTime: 0.2,
  };
  excludeFollowElementClass; /// TODO, crec que aquest és això.

  #xO = 0;
  #yO = 0;
  // #cursorOut = false;
  #eHoveringClassName = "";
  //pròpies a for each
  //this[this.id + "cursorOut" + i]
  //this[this.id + "excluded" + i]
  //this[this.id + "CenterY_var" + i]
  //this[this.id + "CenterX_var" + i]

  constructor(id, options = null) {
    if (id.length < 1) {
      throw new Error("class is mandatory!");
    }
    this.id = id;
    let element = document.querySelectorAll("." + this.id);
    ///////////////////////////OPTIONS
    if (options) {
      options.elementXOffset && (this.#xO = options.elementXOffset);
      options.elementYOffset && (this.#yO = options.elementYOffset);
      options.squinting && (this.squinting = options.squinting);
      options.followOnHoveringElement && (this.followOnHoveringElement = options.followOnHoveringElement);
      options.returnWhenHoveringExcluded && (this.returnWhenOut = options.returnWhenHoveringExcluded);
      options.excludeFollowElementClass &&
        element.forEach((e, i) => {
          this[this.id + "excluded" + i] = options.excludeFollowElementClass
          this[this.id + "cursorOut" + i];

        });
    }

    element.forEach((e, i) => {
      this.#position(e, i);
    });
    this.rotateStart = (e) => this.#followStart(e);
    this.eventListenerFunction = this.rotateStart.bind(this);

    document.querySelector(this.followOnHoveringElement).addEventListener("mousemove", this.eventListenerFunction, true);
  }

  #position = (e, i) => {
    let xOffset = this.#xO === 0 ? "50%" : e.clientWidth / 2 + this.#xO;
    let xUnit = this.#xO === 0 ? "" : "px";
    let yOffset = this.#yO === 0 ? "50%" : e.clientHeight / 2 + this.#yO;
    let yUnit = this.#yO === 0 ? "" : "px";
    let trOr = xOffset + xUnit + " " + yOffset + yUnit;
    e.style.transformOrigin = trOr;
    if (this.#yO != 0) e.style.top = this.#yO * -1 + "px";
    if (this.#xO != 0) e.style.left = this.#xO * -1 + "px";
    this[this.id + "CenterY_var" + i] = Math.round(e.getBoundingClientRect().top + e.clientHeight / 2);
    this[this.id + "CenterX_var" + i] = Math.round(e.getBoundingClientRect().left + e.clientWidth / 2);
  };


  #followStart(ev) {

    let element = document.querySelectorAll(`.${this.id}`);
    if (this.excludeFollowElementClass) {
      // console.log(this.id + " -> " + this.excludeFollowElementClass);
      // si hi ha excludes
    }
    this.#eHoveringClassName = ev.target.className;
    //console.log(this.#eHoveringClassName);
    element.forEach((e, i) => {
      if (this[this.id + "excluded" + i].some((e) => e === this.#eHoveringClassName)) {
        // si el cursor pasa per un exclude
        this[this.id + "cursorOut" + i] = true;
        console.log('estic exclos');
      } else {
        this[this.id + "cursorOut" + i] = false;
        console.log('no estic exclos');
      }
      console.log(this[this.id + "excluded" + i]);
      if (typeof this[this.id + i] === "undefined") {
        this[this.id + i] = false;
      }

      if (!this[this.id + "cursorOut" + i] || !this.excludeFollowElementClass) {
        let ySum = this.#yO === 0 ? 0 : this.#yO > 0 ? 180 : 0;
        let xSum = this.#xO === 0 ? 0 : this.#xO > 0 ? 270 : 90;
        let rad = Math.atan2(ev.clientX - this[this.id + "CenterX_var" + i], ev.clientY - this[this.id + "CenterY_var" + i]);
        let rotation = rad * (180 / Math.PI) * -1 + (this.#yO === 0 ? xSum : ySum) + this.squinting;
        e.style.transform = "rotate(" + rotation + "deg)";
      }
      if (this.returnWhenOut.on) {
        // si la opció returnWhenOut està activat
        if (this[this.id + "cursorOut" + i] & !this[this.id + i]) {
          //si el custor entra en un exclude
          //   console.log("el cursor entra a un exclude");
          e.style.transitionProperty = "transform,transform-origin,top,left";
          e.style.transitionDuration = this.returnWhenOut.transitionTime + "s";
          if (this.returnWhenOut.includeRotation) e.style.transform = "rotate(0deg)"; // si inclou el rotate
          e.style.transformOrigin = "50% 50%";
          e.style.top = "0";
          e.style.left = "0";
          this[this.id + i] = true;
        }
        if (!this[this.id + "cursorOut" + i] & this[this.id + i]) {
          //   console.log("el cursor surt d un exclude");
          this[this.id + i] = false;
          this.#position(e);
          setTimeout(() => {
            e.style.transitionDuration = "0s";
          }, this.returnWhenOut.transitionTime + 100);
        }
      }
    });
  }

  stop() {
    document.querySelector(this.followOnHoveringElement).removeEventListener("mousemove", this.eventListenerFunction);
  }
}
