import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;
  
  const badgeTextStyle = {
    display: "inline-block",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const cardContainerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginBottom: "-20px",
  };
  
  return (
    <Link href={`/course/${slug}`} legacyBehavior>
      <a style={{ textDecoration: "none", height: "100%" }}>
        <Card
          style={cardContainerStyle}
          cover={
            <img
              className="p-1"
              src={image.Location}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
          className="mb=4"
        >
          <h2 className="font-weight-bold text-decoration-none">{name}</h2>
          <p>by {instructor.name}</p>
          <Badge
            count={category}
            style={badgeTextStyle}
            className="pb-2 mr-2"
          />
          <h4 className="pt-2">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "INR",
                })
              : "Free"}
          </h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
