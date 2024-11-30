export default async function LangPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;

  return (
    <div>
      <h1>Welcome to the Top Page!</h1>
      <p>Language: {lang}</p>
    </div>
  );
}
