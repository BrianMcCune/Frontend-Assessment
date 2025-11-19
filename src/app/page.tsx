"use client";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";

type Operator = {
  firstName: string,
  lastName: string,
  opsCompleted: number,
  reliability: number,
  endorsements: string[]
}

type Op = {
  opTitle: string,
  publicId: string,
  operatorsNeeded: number,
  startTime: string,
  endTime: string,
  operators: Operator[]
}

export default function Home() {

  const [data, setData] = useState<Op[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://frontend-challenge.veryableops.com/')
        if (!response.ok) {
          throw new Error(response.status.toString())
        }
        const result = await response.json()
        setData(result)
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    </Stack>
  );
}
