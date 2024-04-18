import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "../../src/components/ui/button";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateColor = () => {
  const params = useParams();
  const { colorId } = params;
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {};
    if (name) {
      options.name = name;
    }
    if (value) {
      options.value = value;
    }
    try {
      const res = await axios.patch(`/api/v1/colors/${colorId}`, options);
      if (res.status === 200) {
        toast.success("Color updated");
      }
      console.log(res.data);
      setTimeout(() => {
        nav("/dashboard?tab=colors");
      }, 1000);
    } catch (error) {
      toast.error(error);
    }
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleValueChange = (val) => {
    setValue(val.target.value);
  };

  return (
    <>
      <div className="py-4 border-b flex justify-between items-end">
        <h1 className="font-bold text-4xl">Updated color</h1>
        <p className="text-gray-700">Updated an existing color</p>
      </div>
      <form onSubmit={handleSubmit} className="my-4">
        <Label htmlFor="name" className="font-semibold text-md">
          Name
        </Label>
        <Input
          onChange={handleNameChange}
          type="text"
          id="name"
          name="name"
          className="mt-4 mb-8 "
          placeholder="color name"
        />
        <Label htmlFor="value" className="font-semibold text-md">
          Value
        </Label>
        <Input
          onChange={handleValueChange}
          type="text"
          id="value"
          name="value"
          className="mt-4 mb-8 "
          placeholder="color (#FFFFFF)"
        ></Input>
        <Button type="submit">Save</Button>
      </form>
    </>
  );
};

export default UpdateColor;
