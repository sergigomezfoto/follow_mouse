// body > main > div:nth-child(7) > div:nth-child(1)

const gRN = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

const closeEyesRandom = (element, number) => {
  let el = [...element];
    // el.forEach(()=>{})

  el.forEach((e) => {
    let oldHeight = e.style.height;
    e.style.height = 0;
    setTimeout(() => {
      e.style.height = oldHeight;
    }, 200);
    setInterval(() => {
      e.style.height = 0;
      setTimeout(() => {
        e.style.height = oldHeight;
      }, 200);
    }, number);
  });
};

const closeEyesAll = (selector) => {
  const eyePair = document.querySelectorAll(selector);
  eyePair.forEach((element) => {

    setTimeout(() => {
      closeEyesRandom(element.children, gRN(3000, 16000));
    }, gRN(100, 5000));
  });

  //closeEyesRandom("body > main > div:nth-child(7) > div",gRN(4000,16000));
};

const mask = document.querySelector('.torch');
document.addEventListener('pointermove', (pos) => {
    let x = parseInt(pos.clientX / window.innerWidth * 100);
    let y = parseInt(pos.clientY / window.innerHeight * 100);

    mask.style.setProperty('--p-x', x + '%');
    mask.style.setProperty('--p-y', y + '%'); 
});


closeEyesAll("body > main > div");
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
  excludeWithS_fex: ['exclude', 'cont'],
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
