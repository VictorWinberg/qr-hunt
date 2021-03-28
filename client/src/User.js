import { request } from "@hyperapp/http";

const GotResult = (state, user) => ({ ...state, user });

const FetchUser = (state) => [
  state,
  request({
    url: `/api/user`,
    expect: "json",
    action: GotResult,
  }),
];

export default (props) => {
  return (
    <h1 onclick={FetchUser}>User: {props.user?.name}</h1>
  );
};
