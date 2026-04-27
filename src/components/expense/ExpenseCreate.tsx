"use client";

import { useState, useMemo } from "react";	
import { useRouter } from "next/navigation";
import { createExpense } from "@/lib/api/expenses";
import { useFriends } from "@/hooks/useFriends";
import { useGroups } from "@/hooks/useGroups";
import { useCategories } from "@/hooks/useCategories";
import ParticipantSelector from "@/components/expense/ParticipantSelector";
import GroupSelector from "@/components/expense/GroupSelector";
import { Group } from "@/types/group";

type Participant = { user_id: number; amount: string };
type GroupMode = "none" | "existing" | "new";

const ExpenseCreate = () => {
  const router = useRouter();
  const { friends } = useFriends();
  const { groups } = useGroups();
  const { categories } = useCategories();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category_id: "",
    start_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [splitEqually, setSplitEqually] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [groupId, setGroupId] = useState("");
  const [newGroup, setNewGroup] = useState<{
    name: string;
    group_type: string;
  } | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  // tracks which friend ids have been added to the new group form
  const [newGroupFriendIds, setNewGroupFriendIds] = useState<number[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // reset participants whenever group mode changes
  const handleModeChange = (mode: GroupMode) => {
    setGroupMode(mode);
    setParticipants([]);
    setNewGroupFriendIds([]);
  };

  // friends visible in ParticipantSelector depend on group mode
  const visibleFriends = useMemo(() => {
    if (groupMode === "none") return [];

    if (groupMode === "existing" && groupId) {
      const selected = groups.find((g) => g.id === groupId) as
        | (Group & { relationships?: { users?: { data?: { id: string }[] } } })
        | undefined;

      // if your serializer includes member ids in relationships use them,
      // otherwise fall back to showing all friends
      const memberIds =
        selected?.relationships?.users?.data?.map((u) => u.id) ?? null;

      if (memberIds) {
        return friends.filter((f) => memberIds.includes(f.id));
      }
      return friends;
    }

    if (groupMode === "new") {
      // only show friends that have been added to the new group
      return friends.filter((f) => newGroupFriendIds.includes(Number(f.id)));
    }

    return friends;
  }, [groupMode, groupId, groups, friends, newGroupFriendIds]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createExpense({
        ...form,
				category_id: form.category_id ? Number(form.category_id) : null,
        split_equally: splitEqually,
        participants,
        group_id: groupId || null,
        new_group: newGroup,
      });
      router.push("/expenses");
    } catch (err: any) {
      setError(err?.response?.data?.errors?.[0] ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-5">
      <h1 className="text-xl font-semibold">New Expense</h1>
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {[
        { name: "title", placeholder: "Title", type: "text" },
        { name: "amount", placeholder: "Amount", type: "number" },
        { name: "start_date", placeholder: "Start date", type: "date" },
      ].map(({ name, placeholder, type }) => (
        <input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name as keyof typeof form]}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      ))}

      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
        <option value="">Select category</option>

        {(categories ?? []).map((cat: any) => (
            <option key={cat.id} value={cat.id}>
            {cat.attributes?.name || cat.name}
            </option>
        ))}
      </select>

      <textarea
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
      />

      <GroupSelector
        groups={groups}
        groupId={groupId}
        newGroup={newGroup}
        onGroupIdChange={setGroupId}
        onNewGroupChange={setNewGroup}
        onModeChange={handleModeChange}
      />

      {/* "Create new" group mode — friend picker for group members */}
      {groupMode === "new" && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Add friends to group
          </p>
          {friends.map((friend) => {
            const id = Number(friend.id);
            const checked = newGroupFriendIds.includes(id);
            return (
              <label key={friend.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setNewGroupFriendIds((prev) =>
                      checked ? prev.filter((i) => i !== id) : [...prev, id]
                    );
                    // also remove from participants if unchecked
                    if (checked) {
                      setParticipants((prev) =>
                        prev.filter((p) => p.user_id !== id)
                      );
                    }
                  }}
                  className="accent-blue-600"
                />
                {friend.attributes.full_name}
              </label>
            );
          })}
        </div>
      )}

      {/* split + participants only when a group is involved */}
      {groupMode !== "none" && (
        <>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={splitEqually}
              onChange={(e) => setSplitEqually(e.target.checked)}
              className="accent-blue-600"
            />
            Split equally
          </label>

          <ParticipantSelector
            friends={visibleFriends}
            participants={participants}
            splitEqually={splitEqually}
            onChange={setParticipants}
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Create Expense"}
      </button>
    </div>
  );
};

export default ExpenseCreate;;
