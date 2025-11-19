"use client";
import { Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";

type Operator = {
  firstName: string,
  lastName: string,
  opsCompleted: number,
  reliability: number,
  endorsements: string[],
  id: number,
  checkIn: string | null
  checkOut: string | null
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
        const response = await fetch('https://frontend-challenge.veryableops.com')
        if (!response.ok) {
          throw new Error(response.status.toString())
        }
        const result: Op[] = await response.json()
        const newData = result.map((op) => ({
          ...op,
          operators: op.operators.map((operator) => ({
            ...operator,
            checkIn: null,
            checkOut: null
          }))
        }))
        setData(newData)
        console.log(newData)
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

    <TableContainer>
      {data.map((op) => (
        <div key={op.publicId}>
          <div>{op.opTitle}</div>
          <div>{op.publicId}</div>
          <div>{op.operatorsNeeded}</div>
          <div>{op.startTime} - {op.endTime}</div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name (First and Last)</TableCell>
                <TableCell>Ops Completed</TableCell>
                <TableCell>Reliability</TableCell>
                <TableCell>Endorsements</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {op.operators.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell>{operator.firstName} {operator.lastName}</TableCell>
                  <TableCell>{operator.opsCompleted}</TableCell>
                  <TableCell>{operator.reliability * 100}%</TableCell>
                  <TableCell>{operator.endorsements.join(", ")}</TableCell>
                  <TableCell>{operator.checkIn}</TableCell>
                  <TableCell>{operator.checkOut}</TableCell>
                </TableRow>
                
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </TableContainer>
    </Stack>
  );
}
