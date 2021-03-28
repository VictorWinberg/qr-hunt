const InputHandler = (state, event) => 
  ({ ...state, name: event.target.value });

export default (props) => (
  <div>
    <h1>Hello, {props.name}</h1>
    <p>
      Please enter your name:
      <input type="text" value={props.name} oninput={InputHandler} />
    </p>
  </div>
);
