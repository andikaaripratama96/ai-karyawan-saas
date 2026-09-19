import { createClient } from "@/lib/supabase-server";
import Workspace from "@/components/Workspace";
import LandingPage from "@/components/LandingPage";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return <Workspace />;
}