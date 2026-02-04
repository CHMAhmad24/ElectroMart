import React from 'react';

function Togle({ registerBtnRef, loginBtnRef }) {
  return (
    <div className="toggle_box">
      {/* Toggle Left: Yeh tab dikhta hai jab Register mode active hota hai */}
      <div className="toggle_panel toggle_left">
        <h1>Welcome Back!</h1>
        <p>Don't Have an account?</p>
        <button className="BTN Register_BTN" ref={registerBtnRef}>Register</button>
      </div>
      
      {/* Toggle Right: Yeh tab dikhta hai jab Login mode active hota hai */}
      <div className="toggle_panel toggle_right">
        <h1>Hello, Welcome!</h1>
        <p>Already Have an account?</p>
        <button className="BTN Login_BTN" ref={loginBtnRef}>Login</button>
      </div>
    </div>
  );
}

export default Togle;