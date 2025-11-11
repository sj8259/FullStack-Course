const App = () => {
  return (
    <main className="container">
      <Header />
      <section className="card">
        <h2>Buttons (Components, Props, State, Events)</h2>
        <div className="row">
          <Button text="Login" color="#0d6efd" />
          <Button text="Logout" color="#dc3545" />
          <Button text="Cancel" />
        </div>
      </section>
      <Counter />
      <RegistrationForm />
    </main>
  );
};


