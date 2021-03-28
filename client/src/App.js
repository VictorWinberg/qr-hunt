import Hello from "./Hello";
import Clicker from "./Clicker";
import List from "./List";
import User from "./User";

export default (state) => (
  <main>
    <Hello name={state.name} />
    <Clicker clicks={state.clicks} />
    <List items={state.items} clicks={state.clicks}/>
    <User user={state.user} />
  </main>
);
