const ClickHandler = (state) => 
  ({ ...state, clicks: state.clicks + 1 });

export default (props) => (
  <p>
    <button onclick={ClickHandler}>Click me</button>
    You have clicked the button {props.clicks} times.
  </p>
);
