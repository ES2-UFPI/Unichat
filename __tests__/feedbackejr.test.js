import React from "react"
import { shallow } from "enzyme"
import { Icon } from "react-native-elements"
import Feedback from "../src/Screens/Feedback/feedback"

describe("rendering", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Feedback />)
  })
  it("Deveria renderizar 5 Views", () => {
    expect(wrapper.find("View")).toHaveLength(5)
  })
  it("Deveria renderizar 1 Icon", () => {
    expect(wrapper.find(Icon)).toHaveLength(1)
  })
  it("prop deve conter a cor #00aced", () => {
    expect(wrapper.find(Icon).prop("color")).toBe("#00aced")
  })
  it("Deveria haver 4 Text", () => {
    expect(wrapper.find("Text")).toHaveLength(4)
  })
})
