export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Sports Data Sender</h1>
      <form action="/api/runscorelord" method="post">
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Sample Data to Slack
        </button>
      </form>
    </main>
  );
}