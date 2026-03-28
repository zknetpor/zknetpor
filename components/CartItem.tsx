'use client';

type CartItemProps = {
  item: any;
  onUpdate: (qty: number) => void;
  onDelete: () => void;
};

export default function CartItem({ item, onUpdate, onDelete }: CartItemProps) {
  return (
    <div className="card p-4 flex items-center justify-between gap-3">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-white/70">{item.size} / {item.color}</p>
        <p className="text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-outline" onClick={() => onUpdate(Math.max(1, item.qty - 1))}>-</button>
        <span>{item.qty}</span>
        <button className="btn-outline" onClick={() => onUpdate(item.qty + 1)}>+</button>
        <button className="btn-outline" onClick={onDelete}>Hapus</button>
      </div>
    </div>
  );
}
