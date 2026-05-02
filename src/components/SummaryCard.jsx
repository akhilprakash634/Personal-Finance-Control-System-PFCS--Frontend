export default function SummaryCard({ title, amount, icon, isDanger, isGradient }) {
  const cardClass = isGradient 
    ? "card card-gradient" 
    : "card";

  return (
    <div className={cardClass}>
      <div className="text-secondary flex items-center gap-2 mb-2" style={{color: isGradient ? 'white' : ''}}>
        {icon} {title}
      </div>
      <h2 className={isDanger ? "text-danger" : ""}>
        ₹{amount?.toLocaleString() || 0}
      </h2>
    </div>
  );
}
