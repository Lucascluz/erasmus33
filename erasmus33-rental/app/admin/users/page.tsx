"use client";

import React, { Key, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User as UserComponent,
  Pagination,
  Spinner,
} from "@heroui/react";
import { pseudoUsers } from "@/lib/psuedo-users";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@/interfaces/user";

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "CONTACT", uid: "contact" },
  { name: "HOUSE", uid: "house" },
  { name: "NATIONALITY", uid: "nationality" },
  { name: "LANGUAGE", uid: "language" },
  { name: "STAY", uid: "stay" },
  { name: "ROLE", uid: "role" },
  { name: "ACTIONS", uid: "actions" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = ["name", "contact", "room", "role", "actions"];

export default function App() {
  const router = useRouter();

  // Add a loading state to prevent hydration issues
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);

  // Initialize data on the client-side only to avoid hydration mismatch
  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionUserData } = await supabase.auth.getUser();
      const fetchUsers = async () => {
        const { data, error } = await supabase.from("users").select("*");
        // .neq("id", sessionUserData.user?.id);
        if (error) console.error("Error fetching users:", error);
        else setUsers(data);
        console.log(data);
      };
      fetchUsers();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.size === columns.length) return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  function getSortValue(user: User, column: string) {
    switch (column) {
      case "name":
        return `${user.first_name} ${user.last_name}`;
      case "room":
        return user.room_number || 0;
      default:
        return user[column as keyof User] || "";
    }
  }

  const renderCell = React.useCallback((user: User, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return (
          <UserComponent
            avatarProps={{ radius: "lg", src: user.profile_picture }}
            description={user.email}
            name={`${user.first_name} ${user.last_name}`}
          >
            {user.email}
          </UserComponent>
        );
      case "contact":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{user.phone_number}</p>
            <p className="text-bold text-tiny text-default-400">
              {user.pt_phone_number}
            </p>
          </div>
        );
      case "house":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">House {user.house_number}</p>
            <p className="text-bold text-tiny text-default-400">
              Room {user.room_number}
            </p>
          </div>
        );
      case "country":
        return <span className="capitalize">{user.country}</span>;
      case "language":
        return (
          <Chip
            className="capitalize"
            color={user.preferred_language === "pt" ? "primary" : "secondary"}
            size="sm"
            variant="flat"
          >
            {user.preferred_language}
          </Chip>
        );
      case "stay":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {user.arrival_date ? new Date(user.arrival_date).toLocaleDateString() : "Not Renting"}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {user.departure_estimate ? new Date(user.departure_estimate).toLocaleDateString() : ""}
            </p>
          </div>
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={
              user.role === "admin"
                ? "primary"
                : user.role === "renter"
                  ? "secondary"
                  : "default"
            }
            size="sm"
            variant="flat"
          >
            {user.role}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon
                    icon="lucide:more-vertical"
                    className="text-default-300"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="view"
                  onPress={() => router.push(`/admin/users/${user.id}`)}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onPress={() => router.push(`/admin/users/edit/${user.id}`)}
                >
                  Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<Icon icon="lucide:search" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon="lucide:chevron-down" className="text-small" />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setVisibleColumns(new Set(keys as unknown as string[]))
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [filteredItems.length, page, pages]);

  // Render a loading state if data isn't ready
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Table
      isHeaderSticky
      aria-label="User management table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.uid === "actions" ? "" : capitalize(column.name)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
