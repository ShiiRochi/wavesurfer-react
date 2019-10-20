import React from "react";

const TimeLine = ({ id }) => {
    return <div id={id} />;
};

TimeLine.defaultProps = {
    id: "timeline"
};

export default TimeLine;
