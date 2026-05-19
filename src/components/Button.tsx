type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition">
      {text}
    </button>
  );
}