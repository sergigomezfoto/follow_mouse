
////////////////////////////////////////////////////////VARIABLE ASSIGNATION
const back = document.querySelector("img.back");
const night = document.querySelector(".night");
const docStyle = document.documentElement.style;
let vw = document.documentElement.clientWidth;
let vh = document.documentElement.clientHeight;

const centerCanvas = (wW) => {
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
};

///////////////////////////////////////////////////////////////////////////NIGHT LANTENR//////////////////////////////////////////////////
const nightLantern = (wW, wH) => {
  docStyle.setProperty("--wrapperHeight", `${wH}px`);
  night.addEventListener("pointermove", (pos) => {
    const wrapperLeftPosition = (vw - wW) / 2;
    const wrapperTopPosition = vh - wH;
    const xOffset = wrapperLeftPosition / wW;
    const yOffset = wrapperTopPosition / wH;
    let x = parseInt((pos.clientX / wW - (xOffset >= 0 ? xOffset : 0)) * 100);
    let y = parseInt((pos.clientY / wH - yOffset) * 100);
    docStyle.setProperty("--p-x", x + "%");
    docStyle.setProperty("--p-y", y + "%");
  });
};

///////////////////////////////////////////////////////CLOSE EYES/////////////////////////////////////////////////////////////////
const closeEyes = (selector) => {
  const oldHeight = '0%'
  const openHeight= '90%'
  let totalElementCount=0;
  const closeEyesRandom = (element, number) => {
    let el = [...element];
    // el.forEach(()=>{})
    totalElementCount = totalElementCount +1 ;
    console.log(totalElementCount);
    console.log(el.length);
    el.forEach((e) => {
      // let oldHeight = e.style.height;
      e.style.height = openHeight;
      // setTimeout(() => {
      //   e.style.height = oldHeight;
      // }, 200);
      setInterval(() => {
        e.style.height = oldHeight;
        setTimeout(() => {
          e.style.height = openHeight;
        }, 200);
      }, number);
    });
  };
  const eyePair = document.querySelectorAll(selector);
  eyePair.forEach((element) => {
    totalElementCount = + 1;
    setTimeout(() => {
      closeEyesRandom(element.children, randomNumber(3000, 16000));
    }, randomNumber(100, 5000));
  });
};

////////////////////////////////////////////////////////////////////////////APP//////////////////////////////////////////////////////////////
centerCanvas(1536);
nightLantern(1536, 1021);
closeEyes("main > div");
//

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
  excludeWithS_fex: ["exclude", "cont"],
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
