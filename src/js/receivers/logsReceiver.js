/* @flow */

import * as actions from "../actions/mainSearch"
import {discoverDescriptors} from "../actions/descriptors"
import throttle from "lodash/throttle"
import type {Payload} from "./types"

export default function(dispatch: Function) {
  let buffer = []

  const dispatchEvents = throttle(() => {
    if (buffer.length === 0) return
    dispatch(actions.mainSearchEvents(buffer))
    dispatch(discoverDescriptors(buffer))
    buffer = []
  }, 200)

  return (payload: Payload) => {
    if (payload.type === "SearchResult") {
      const tuples = payload.results.tuples
      if (tuples.length) {
        buffer = [...buffer, ...tuples]
        dispatchEvents()
      }
    }
  }
}