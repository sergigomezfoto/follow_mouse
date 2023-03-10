//TODOPOSAR L'ENLLAÇ CORRECTE.
window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

const randomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
  // return new Promise((resolve) => setTimeout(resolve, ms/1000));
};

(() => {
  ////////////////////////////////////////////////////////VARIABLE ASSIGNATION
  const night = document.querySelector(".night");
  const docStyle = document.documentElement.style;
  let vw = document.documentElement.clientWidth;
  let vh = document.documentElement.clientHeight;
  ///////////////////////////////////////////////////////////////////////////CENTER CANVAS
  const centerCanvas = (wW, wH) => {
    if (window.mobileAndTabletCheck()) {
      docStyle.setProperty("--wrapperWidthDynamic", "100vw");
    } else {
      docStyle.setProperty("--wrapperWidthDynamic", `${wW}px`);
    }
    const resizeCalculations = () => {
      vw = document.documentElement.clientWidth;
      vh = document.documentElement.clientHeight;
      docStyle.setProperty("--vh", document.documentElement.clientHeight);
      docStyle.setProperty("--vw", document.documentElement.clientWidth);
      const wrapperLeftPosition = (vw - wW) / 2;
      if (vw > wW) {
        docStyle.setProperty("--wrapperLeftPosition", `${wrapperLeftPosition}px`);
      } else {
        docStyle.setProperty("--wrapperLeftPosition", `0px`);
      }
    };

    resizeCalculations();
    window.addEventListener("resize", () => {
      resizeCalculations();
    });
    docStyle.setProperty("--wrapperHeight", `${wH}px`);
  };

  /////////////////////////////////////////////////////////////////////////////////////////CARATULE TITLES
  const element = async (el) => {
    el.style.display = "block";
    await sleep(500);
    el.style.opacity = "1";
    await sleep(2000);
    el.style.opacity = "0";
    await sleep(1000);
    el.style.display = "none";
  };

  const caratuleTitles = async () => {
    const titleLines = document.querySelectorAll("div.caratule > span");
    for (const el of titleLines) {
      await element(el);
    }
    document.querySelector(".night").style.opacity = "1";
    await sleep(3000);
    // document.querySelector("body").style.cursor = "none";
    document.querySelector("header").style.opacity = "1";
    document.querySelector(".night").classList.add("nigt-masked");
  };
  ///////////////////////////////////////////////////////////////////////////////PUT SIGN
  const putSign = () => {
    const sign = document.querySelector(".sign");
    if (mobileAndTabletCheck()) {
      sign.style.bottom="347px";
      sign.style.left= "8px"

    }
    sign.style.display = "block";
    sign.addEventListener("click", () => {
      console.log("hooooolaaaaaa");
    });
  };

  ///////////////////////////////////////////////////////////////////////////////CLOSE EYES
  const enterMonstersCloseEyes = async (selector) => {
    const oldHeight = "0%";
    const openHeight = "90%";
    const enterMonstersCloseEyesRandom = async (element, number) => {
      let el = [...element];
      totalElementCount = totalElementCount + 1;
      if (eyePair.length === totalElementCount) {
        await sleep(1000);
        nightLantern(1536, 1021);
      }
      el.forEach(async (e) => {
        e.style.visibility = "visible";
        await sleep(500);
        e.style.height = openHeight;
        setInterval(async () => {
          e.style.height = oldHeight;
          await sleep(200);
          e.style.height = openHeight;
        }, number);
      });
    };
    const eyePair = document.querySelectorAll(selector);
    let totalElementCount = 0;
    eyePair.forEach((element) => {
      setTimeout(async () => {
        await enterMonstersCloseEyesRandom(element.children, randomNumber(3000, 16000));
      }, randomNumber(100, 3000));
    });
  };

  ///////////////////////////////////////////////////////////////////////////NIGHT LANTENR
  const nightLantern = (wW, wH) => {
    const desktopOrMobileLanternEvent = (pos, mobile) => {
      // pos.preventDefault();
      const wrapperLeftPosition = (vw - wW) / 2;
      const wrapperTopPosition = vh - wH;
      const xOffset = wrapperLeftPosition / wW;
      const yOffset = wrapperTopPosition / wH;
      let x = parseInt(((mobile ? pos.targetTouches[0].clientX : pos.clientX) / wW - (xOffset >= 0 ? xOffset : 0)) * 100);
      let y = parseInt(((mobile ? pos.targetTouches[0].clientY : pos.clientY) / wH - yOffset) * 100);
      document.querySelector(".night").style.pointerEvents = "none";
      docStyle.setProperty("--p-x", x + "%");
      docStyle.setProperty("--p-x", x + "%");
      docStyle.setProperty("--p-y", y + "%");
    };

    if (mobileAndTabletCheck()) {
      const event = document.querySelector(".wrapper").addEventListener(
        "touchmove",
        (pos) => {
          desktopOrMobileLanternEvent(pos, true);
        },
        { passive: false }
      );
    } else {
      document.querySelector(".wrapper").addEventListener("mousemove", (pos) => {
        desktopOrMobileLanternEvent(pos, false);
      });
    }
  };

  ////////////////////////////////////////////////////////////////////////////APP//////////////////////////////////////////////////////////////
  centerCanvas(1536, 1021);
  window.onload = async () => {
    await caratuleTitles();
    putSign();
    enterMonstersCloseEyes("main > div");
  };
  //
})();

let eyes = new S_turn("u1", {
  followOnHoveringElement: "body",
  // degreeRange:[180,360],
  yOffset: 0,
  yOffsetCompensation: 0,
  yDeviation: 0,
  xOffset: 10,
  xOffsetCompensation: 0,
  xDeviation: 0,
  followDeacceleration: 0,
  gDeviation: 0,
  gMulFactor: 0,
  excludeWithS_fex: ["sign"],
  easyReturn: {
    on: true,
    includeRotation: false,
    includeOrigin: true,
    transitionTime: 0.2,
    tFunction: "cubic-bezier(1, 0, 0, 1.5)",
  },
});
// setTimeout(() => {

//     console.log(eyes);
// }, );
// setInterval(() => {

//     if (eyes.hovering_excluded) {
//         console.log('estic totalment excluit');
//     }
// }, 200);

// let clock = new S_turn('.clock_stick'
// , {
//         followOnHoveringElement: '.f',
//         degreeRange:[-90,90],
//         yOffset: -25,
//         yOffsetCompensation:25,
//         yDeviation: 0,
//         xOffset: 0,
//         xOffsetCompensation: 0,
//         xDeviation: 0,
//         followDeacceleration:20,
//         gDeviation: 0,
//         gMulFactor: 1,
//         // excludeWithS_fex: ['exclude'],
//         easyReturn: {
//             on: true,
//             includeRotation: true,
//             includeOrigin: false,
//             transitionTime: 0.2,
//         },
//     }
// );

// setTimeout(() => {
//     clock.stop();
// }, 5000);
// setTimeout(() => {
//     eyes.pause(true);
// }, 5000);
// setTimeout(() => {
//     eyes.resume(true);
// }, 10000);
// setTimeout(() => {

//     clock.pause();
// }, 7000);
// setTimeout(() => {

//     clock.resume();
// }, 12000);
// setTimeout(() => {
//     eyes.update(
//         {
//             followOnHoveringElement: '.exclude',
//             yOffset: 0,
//             yOffsetCompensation: 0,
//             yDeviation: 0,
//             xOffset: 10,
//             xOffsetCompensation: -10,
//             xDeviation: 0,
//             gDeviation: 0,
//             gMulFactor: 0,
//             excludeWithS_fex: ['body'],
//             easyReturn: {
//                 on: true,
//                 includeRotation: false,
//                 includeOrigin: true,
//                 transitionTime: 0.2,
//             },
//         }
//     )
// },3000);
