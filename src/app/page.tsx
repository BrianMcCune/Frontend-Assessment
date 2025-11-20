"use client";
import moment from "moment";
import { Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from "@mui/material";
import React, { useEffect, useState } from "react";

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
  const [search, setSearch] = useState<string>('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const filteredData = data
    .map((op) => {
      const opMatches =
        op.opTitle.toLowerCase().includes(search.toLowerCase()) ||
        op.publicId.toLowerCase().includes(search.toLowerCase())

      const filteredOperators = op.operators.filter((operator) =>
        `${operator.firstName} ${operator.lastName}`.toLowerCase().includes(search.toLowerCase())
      )

      if (opMatches || filteredOperators.length > 0) {
        return {
          ...op,
          operators: filteredOperators.length > 0 ? filteredOperators : op.operators,
        };
      }

      return null
    })
  .filter((op): op is Op => Boolean(op))

  const handleSortName = () => {
    setData((prev) => 
      prev.map((op) => ({
        ...op,
        operators: [...op.operators].sort((a, b) => a.firstName.localeCompare(b.firstName))
      }))
    )
  }

  const handleSortOps = () => {
    setData((prev) => 
      prev.map((op) => ({
        ...op,
        operators: [...op.operators].sort((a, b) => a.opsCompleted - b.opsCompleted)
      }))
    )
  }

  const handleSortReliability = () => {
    setData((prev) => 
      prev.map((op) => ({
        ...op,
        operators: [...op.operators].sort((a, b) => a.reliability - b.reliability)
      }))
    )
  }

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
      <input type="text" value={search} onChange={handleSearch} style={{ position: 'absolute', top: '3vh'}}/>
      <TableContainer
        sx={{
          width: "80%"
        }}
      >
        {filteredData.map((op) => (
          <div key={op.publicId} style={{ marginBottom: '2rem', fontWeight: 'bold', minHeight: 400 }}>
            <div>Title: {op.opTitle}</div>
            <div>ID: {op.publicId}</div>
            <div>Operators Needed: {op.operatorsNeeded}</div>
            <div>Timeframe: {moment(op.startTime).format("MMM D, YYYY h:mm A")} - {moment(op.endTime).format("MMM D, YYYY h:mm A")}</div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><TableSortLabel onClick={handleSortName}>Name (First and Last)</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel onClick={handleSortOps}>Ops Completed</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel onClick={handleSortReliability}>Reliability</TableSortLabel></TableCell>
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
                    <TableCell sx={{ minWidth: 200 }}>{operator.checkIn} <input disabled={!!operator.checkIn} onChange={() => handleCheckIn(operator.id)} type="checkbox" /></TableCell>
                    <TableCell sx={{ minWidth: 200 }}>{operator.checkOut} <input disabled={!operator.checkIn || !!operator.checkOut} onChange={() => handleCheckOut(operator.id)} type="checkbox" /></TableCell>
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
