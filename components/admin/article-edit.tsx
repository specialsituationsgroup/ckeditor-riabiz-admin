/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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
