import React, { useRef, useEffect } from 'react';
import './style.css';
import { gsap } from 'gsap';

const Logo = () => {
  const logo = useRef();
  const letters = useRef();
  const middleL = useRef();
  const middleR = useRef();

  useEffect(() => {
    const smallLettersAnimation = gsap.to(letters.current, {
      opacity: 1,
      duration: 1.5,
      paused: true,
      ease: 'power1.inOut',
    });

    const middleLAnimation = gsap.to(middleL.current, {
      width: '100%',
      opacity: 1,
      duration: 1.5,
      paused: true,
      paddingRight: '5px',
      ease: 'power1.inOut',
    });
    const middleRAnimation = gsap.to(middleR.current, {
      width: '100%',
      duration: 1.68,
      opacity: 1,
      paused: true,
      paddingLeft: '5px',
      ease: 'power1.inOut',
    });
    const play = () => {
      smallLettersAnimation.play();
      middleLAnimation.play();
      middleRAnimation.play();
    };

    play();
  }, []);

  return (
    <div className="logo" ref={logo}>
      <span className="letter">E</span>
      <span className="small-letters" ref={middleL}>
        ducate
      </span>
      <span className="small-letters" ref={middleR}>
        your
      </span>
      <span className="letter">S</span>
      <span className="small-letters" ref={letters}>
        elf
      </span>
    </div>
  );
};

export default Logo;
