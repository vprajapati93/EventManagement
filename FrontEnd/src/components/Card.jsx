const Card = ({ name, eventType, dateTime, guests, phone }) => {
  return (
    <div className="border rounded p-4 mb-4">
      <p className="font-semibold">{name}</p>
      <p>{eventType}</p>
      <p>{new Date(dateTime).toLocaleString("en-GB")}</p>
      <p>{guests} guests</p>
      <p>{phone}</p>
    </div>
  );
};

export default Card;
