import {
  createEmployee,
  deleteEmployee,
  getEmployees,
} from "@/lib/sanity/utils/employee";
import { getAllRoles } from "@/lib/sanity/utils/role";
import { getAllDepartments } from "@/lib/sanity/utils/department";

const EmployeesPage = async () => {
  const employees = await getEmployees();
  const roles = await getAllRoles();
  const departments = await getAllDepartments();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

      {/* Create Employee Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
        <form
          action={async (formData: FormData) => {
            "use server";

            const departmentId = formData.get("departmentId") as string;
            const roleId = formData.get("roleId") as string;

            const newEmployee = {
              name: formData.get("name") as string,
              email: formData.get("email") as string,
              phone: formData.get("phone") as string,

              employmentStatus: "active",
              roleId,
              departmentId,
              startDate: new Date().toISOString().slice(0, 10),
              documents: [],
            };

            await createEmployee(newEmployee);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input type="text" name="name" required className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input type="email" name="email" required className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input type="tel" name="phone" required className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select name="roleId" required className="input-style">
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select name="departmentId" required className="input-style">
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Employee
          </button>
        </form>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Employees List</h2>
        <div className="divide-y">
          {employees.map((employee) => (
            <div
              key={employee._id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.email}</p>
                <p className="text-sm text-gray-600">{employee.phone}</p>
                <p className="text-sm text-gray-600">
                  Role: {employee.role?.title}
                </p>
                <p className="text-sm text-gray-600">
                  Department: {employee.department?.name}
                </p>
              </div>
              <div>
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const id = formData.get("id") as string;
                    await deleteEmployee(id);
                  }}
                >
                  <input type="hidden" name="id" value={employee._id} />
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;

// Styling shortcut
const inputStyle =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";
