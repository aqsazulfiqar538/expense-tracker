// components/expenses/ParticipantSelector.tsx
import { Friend } from "@/types/friend";

type Participant = { user_id: number; amount: string };

type Props = {
  friends: Friend[];           // parent passes filtered list based on group mode
  participants: Participant[];
  splitEqually: boolean;
  onChange: (participants: Participant[]) => void;
};

const ParticipantSelector = ({
  friends,
  participants,
  splitEqually,
  onChange,
}: Props) => {
  const selectedIds = participants.map((p) => p.user_id);

  const toggle = (friendId: number) => {
    if (selectedIds.includes(friendId)) {
      onChange(participants.filter((p) => p.user_id !== friendId));
    } else {
      onChange([...participants, { user_id: friendId, amount: "" }]);
    }
  };

  const updateAmount = (userId: number, amount: string) => {
    onChange(
      participants.map((p) => (p.user_id === userId ? { ...p, amount } : p))
    );
  };

  if (friends.length === 0)
    return (
      <p className="text-sm text-gray-400">
        No friends available to add as participants.
      </p>
    );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Participants</p>
      {friends.map((friend) => {
        const isSelected = selectedIds.includes(Number(friend.id));
        const participant = participants.find(
          (p) => p.user_id === Number(friend.id)
        );

        return (
          <div key={friend.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggle(Number(friend.id))}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700 flex-1">
              {friend.attributes.full_name}
            </span>
            {/* amount input only when checked AND split is not equal */}
            {isSelected && !splitEqually && (
              <input
                type="number"
                placeholder="Amount"
                value={participant?.amount ?? ""}
                onChange={(e) =>
                  updateAmount(Number(friend.id), e.target.value)
                }
                className="w-28 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantSelector;
