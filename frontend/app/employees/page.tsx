import { auth } from "@/lib/auth";
import { Magnet } from "lucide-react";
import { redirect } from "next/navigation";


const EmployeesPage = async () => {
  const session = await auth();
  const role = session?.user?.role;


  if (role === "admin") {
    const { default: AdminEmployeesPage } = await import("./AdminEmployeesPage");
    return <AdminEmployeesPage />;
  } else if (role === "manager") {
    const { default: ManagerEmployeesPage } = await import("./ManagerEmployeesPage");
    const mangerId = session?.user?.id;
    if (!mangerId) {
      console.error("Manager ID is not available in session");
      redirect("/dashboard");
    }
    return <ManagerEmployeesPage id={mangerId}/>;
  } else {
    console.log("Unauthorized access attempt by role:", role);
    redirect("/dashboard");
  }
};

export default EmployeesPage;
