"use client";
import moment from "moment";
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

  const handleCheckIn = (id: number) => {
    setData(prev => prev.map((op) => ({
      ...op,
      operators: op.operators.map((operator) => (
        operator.id === id ? {...operator, checkIn: moment().format("MMM D, YYYY h:mm A")} : operator
      ))
    })))
  }

  const handleCheckOut = (id: number) => {
    setData(prev => prev.map((op) => ({
      ...op,
      operators: op.operators.map((operator) => (
        operator.id === id ? {...operator, checkOut: moment().format("MMM D, YYYY h:mm A")} : operator
      ))
    })))
  }

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
          <div>{moment(op.startTime).format("MMM D, YYYY h:mm A")} - {moment(op.endTime).format("MMM D, YYYY h:mm A")}</div>
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
                  <TableCell>{operator.checkIn} <input disabled={!!operator.checkIn} onChange={() => handleCheckIn(operator.id)} type="checkbox"></input></TableCell>
                  <TableCell>{operator.checkOut} <input disabled={!!operator.checkOut} onChange={() => handleCheckOut(operator.id)} type="checkbox"></input></TableCell>
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
