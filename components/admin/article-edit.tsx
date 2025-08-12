import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const AdminText = styled.div`
  font-weight: 900;
  font-size: 1rem;
  align-items: center;
  display: flex;
  padding-top: 1rem;
`;

export default function AdminArticleEdit({ articlePk }: { articlePk: number }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status == "loading") return; // Do nothing while loading
  }, [status]);

  if (!session?.is_staff) return null;

  return (
    <AdminText>
      <span>Admin:</span>
      <Link href={`/admin/a/${articlePk}`} passHref>

        <EditIcon fontSize="medium" style={{ marginLeft: "0.25rem" }} />

      </Link>
    </AdminText>
  );
}
