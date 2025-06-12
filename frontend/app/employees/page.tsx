import React from 'react'
import { getEmployees } from '@/lib/sanity/utils/employee'

const page = async() => {
    const employees = await getEmployees();
  
  return (
    <div>
      {employees.map((employee) => (
        <div key={employee._id}>
          {employee.name}
          <p>{employee.role.title}</p>
          <p>{employee.departmentName}</p>
          <p>{employee.startDate}</p>
        </div>
      ))}
    </div>
  );
}

export default page