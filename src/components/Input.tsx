type InputProps = {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-3 rounded-lg w-full outline-none focus:border-blue-500"
    />
  );
}