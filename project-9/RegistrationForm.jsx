const { useState } = React;

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Form Submitted!\nName: ${formData.name}\nEmail: ${formData.email}\nAge: ${formData.age}`);
  };
  return (
    <section className="card">
      <h2>Controlled Form</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </label>
        <label>
          Age
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
            placeholder="Enter your age"
            required
          />
        </label>
        <button type="submit" className="btn submit">Submit</button>
      </form>
      <div className="preview">
        <h3>Current Form Data</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </section>
  );
};


