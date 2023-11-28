import React from "react";
import Region, { RegionProps } from "./Region";

/**
 * After wavesurfer.js@^7, Marker can be created with Region w/o end.
 * I.e., a region should have no duration to behave like a marker.
 */
export default function Marker(props: Omit<RegionProps, "end">) {
    return <Region {...props} />
}
