import { FormGenerator } from "src";
import { mount } from "@vue/test-utils";
import { FormField } from "src/types";

const fields: FormField[] = [
  {
    name: "test01",
    label: "Test 01",
    type: "text",
    required: true,
  },
  {
    name: "test02",
    label: "Test 02",
    type: "text",
    required: true,
  },
  {
    name: "nested",
    type: "fields",
    fields: [
      {
        name: "test11",
        label: "Test 11",
        type: "text",
        required: true,
      },
      {
        name: "test12",
        label: "Test 12",
        type: "text",
        required: true,
      },
    ],
  },
];

describe("form generator", () => {
  it("shows nested fields", async () => {
    const generator = mount(FormGenerator, {
      props: {
        fields: fields,
        request: () => Promise.resolve(),
      },
    });
    expect(generator).toBeTruthy();

    const label = generator.find("label");
    expect(label.text()).toContain("Test 01");

    expect(generator.text()).toContain("Test 12");
  });

  it("shows errors", async () => {
    const request = () =>
      Promise.reject({
        paramErrors: {
          test01: ["Error01"],
          nested: { test11: ["Error11"] },
        },
        title: "Request Param Error",
      });

    const generator = mount(FormGenerator, {
      props: {
        fields: fields,
        request: request,
      },
    });

    await generator.find("form").trigger("submit");

    expect(generator.text()).toContain("Error01");
    expect(generator.text()).toContain("Error11");
  });

  it("exposes the data", async () => {
    const request = () => Promise.resolve();

    const data = { test: "test" };

    const generator = mount(FormGenerator, {
      props: {
        fields: fields,
        request: request,
        data: data,
      },
    });

    expect(generator.vm.data).toEqual(data);

    generator.vm.data["test1"] = "test1";

    expect(data["test1"]).toEqual("test1");
  });
});
