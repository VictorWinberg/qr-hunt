const Highscore = ({ items }) =>
  Object.entries(
    items.reduce((curr, item) => {
      if (!curr[item.name]) {
        curr[item.name] = 1;
      } else {
        curr[item.name] += 1;
      }
      return curr;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0][0];

const ClickHandler = (state, item) =>
  ({...state, items: state.items.concat(item)})

const Item = (item, idx) => (
  <button onclick={[ClickHandler, item]}>{idx} - {item.name}</button>
);

export default (props) => (
  <div>
    {props.clicks
      ? <h2>It has Clicks</h2>
      : "No clicks found :("}
    <h1>Winner {Highscore(props)}</h1>
    <ul>{props.items.map((item, idx) => Item(item, idx))}</ul>
  </div>
);
