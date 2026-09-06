import "../css/Cateory.css"

const Category = ({ activeFilter, setActiveFilter }) => {

    const categories = [
        { key: "all", label: "All" },
        { key: "fullstack", label: "Full Stack" },
        { key: "java", label: "Java" },
        { key: "frontend", label: "Frontend" },
        { key: "python", label: "Python" },

    ];

    return (
        <div className="filter-bar">
            {categories.map((category) => (
                <button
                    key={category.key}
                    className={`filter-btn ${activeFilter === category.key
                        ? "active"
                        : ""
                        }`}
                    onClick={() =>
                        setActiveFilter(category.key)
                    }
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
};

export default Category;
