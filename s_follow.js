class S_turn {
  id;
  squinting = 0;
  followOnHoveringElement = "body";
  returnWhenHoveringExcluded = {
    on: false,
    includeRotation: false,
    transitionTime: 0.2,
  };
  excludeFollowElementClass;
  #xO=0;
  #yO=0;
  #cursorOut = false;
  #eHoveringClassName = "";

  constructor(id, options = null) {
    if (id.length < 1) {
      throw new Error("class is mandatory!");
    }

    this.id = id;
    ///////////////////////////OPTIONS
    if (options) {
      options.elementXOffset && (this.#xO = options.elementXOffset);
      options.elementYOffset && (this.#yO = options.elementYOffset);
      options.squinting && (this.squinting = options.squinting);
      options.followOnHoveringElement && (this.followOnHoveringElement = options.followOnHoveringElement);
      options.returnWhenHoveringExcluded && (this.returnWhenOut = options.returnWhenHoveringExcluded);
      options.excludeFollowElementClass && (this.excludeFollowElementClass = options.excludeFollowElementClass);
    }

    let element = document.querySelectorAll("." + this.id);
    element.forEach((e) => {
      this.#position(e);
    });
    this.rotateStart = () => this.#followStart();
    this.eventListenerFunction = this.rotateStart.bind(this);
    document.querySelector(this.followOnHoveringElement).addEventListener("mousemove", this.eventListenerFunction);
  }

  #position = (e) => {
    let xOffset = this.#xO === 0 ? "50%" : e.clientWidth / 2 + this.#xO;
    let xUnit = this.#xO === 0 ? "" : "px";
    let yOffset = this.#yO === 0 ? "50%" : e.clientHeight / 2 + this.#yO;
    let yUnit = this.#yO === 0 ? "" : "px";
    let trOr = xOffset + xUnit + " " + yOffset + yUnit;
    e.style.transformOrigin = trOr;
    if (this.#yO != 0) e.style.top = this.#yO * -1 + "px";
    if (this.#xO != 0) e.style.left = this.#xO * -1 + "px";
};

  #followStart(ev) {
    let element = document.querySelectorAll(`.${this.id}`);
    if (this.excludeFollowElementClass) {
        // si hi ha excludes
      document.onmousemove = (e) => {
          this.#eHoveringClassName = e.target.className;
          if (this.excludeFollowElementClass.some((e) => e === this.#eHoveringClassName)) {
              // si el cursor pasa per un exclude
              this.#cursorOut = true;
            } else {
          this.#cursorOut = false;
        }
      };
    }

    element.forEach((e, i) => {
        if (typeof this[this.id + i] === "undefined") {
            this[this.id + i] = false;
        }
        if (!this.#cursorOut || !this.excludeFollowElementClass) {

            
            // si el custor no passa per un exclude O no hi ha excludes
            let x = e.getBoundingClientRect().left + e.clientWidth / 2;
            let y = e.getBoundingClientRect().top + e.clientHeight / 2;
            let mouseX = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
            let mouseY = !isTouchDevice() ? event.clientY : event.touches[0].clientY;
            let rad = Math.atan2(mouseX - x, mouseY - y);
            let ySum = this.#yO === 0 ? 0 : this.#yO > 0 ? 180 : 0;
            let xSum = this.#xO === 0 ? 0 : this.#xO > 0 ? 270 : 90;
            let rotation = rad * (180 / Math.PI) * -1 + (this.#yO === 0 ? xSum : ySum) + this.squinting; //ySum //270 x
            e.style.transform = "rotate(" + rotation + "deg)";
            console.log(e.getClientRects()[0].height);
            console.log(e.getBoundingClientRect().top);

    

      }
      if (this.returnWhenOut.on) {
        // si la opció returnWhenOut està activat
        if (this.#cursorOut & !this[this.id + i]) {
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
        if (!this.#cursorOut & this[this.id + i]) {
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
