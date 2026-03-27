// src/components/common/Input.jsx
export default function Input({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      {props.type === 'select' ? (
        <select id={props.id || props.name} {...props}>
          {props.children}
        </select>
      ) : (
        <input id={props.id || props.name} {...props} />
      )}
      {error && <span className="msg msg--error" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>{error}</span>}
    </div>
  )
}