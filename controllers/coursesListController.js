// controllers/coursesListController.js
import { CourseModel } from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";

const fmtDateOnly = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBA";

export const coursesListPage = async (req, res, next) => {
  try {
    // Query params
    const {
      level,
      type,
      dropin,
      q,
      page = "1",
      pageSize = "10",
    } = req.query;

    // NORMALISE FILTERS (important for consistency)
    const filters = {
      level: level || "",
      type: type || "",
      dropin: dropin || "",
      q: q || "",
    };

    // Base DB filter
    const filter = {};
    if (filters.level) filter.level = filters.level;
    if (filters.type) filter.type = filters.type;
    if (filters.dropin === "yes") filter.allowDropIn = true;
    if (filters.dropin === "no") filter.allowDropIn = false;

    // Fetch courses
    let courses = await CourseModel.list(filter);

    // SEARCH
    const needle = filters.q.trim().toLowerCase();
    if (needle) {
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(needle) ||
          c.description?.toLowerCase().includes(needle)
      );
    }

    // SORT
    courses.sort((a, b) => {
      const ad = a.startDate
        ? new Date(a.startDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bd = b.startDate
        ? new Date(b.startDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      if (ad !== bd) return ad - bd;
      return (a.title || "").localeCompare(b.title || "");
    });

    // PAGINATION
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.max(1, parseInt(pageSize, 10) || 10);
    const total = courses.length;
    const totalPages = Math.max(1, Math.ceil(total / ps));
    const start = (p - 1) * ps;
    const pageItems = courses.slice(start, start + ps);

    // ENRICH COURSES
    const cards = await Promise.all(
      pageItems.map(async (c) => {
        const sessions = await SessionModel.listByCourse(c._id);
        const first = sessions[0];

        return {
          id: c._id,
          title: c.title,
          level: c.level,
          type: c.type,
          allowDropIn: c.allowDropIn,
          startDate: fmtDateOnly(c.startDate),
          endDate: fmtDateOnly(c.endDate),
          nextSession: first ? fmtDateTime(first.startDateTime) : "TBA",
          sessionsCount: sessions.length,
          description: c.description,
        };
      })
    );

    // FILTER FLAGS (THIS IS THE KEY ADDITION)
    const flags = {
      isBeginner: filters.level === "beginner",
      isIntermediate: filters.level === "intermediate",
      isAdvanced: filters.level === "advanced",

      isWeekly: filters.type === "WEEKLY_BLOCK",
      isWorkshop: filters.type === "WEEKEND_WORKSHOP",

      isDropInYes: filters.dropin === "yes",
      isDropInNo: filters.dropin === "no",
    };

    // PAGINATION MODEL
    const pagination = {
      page: p,
      pageSize: ps,
      total,
      totalPages,
      hasPrev: p > 1,
      hasNext: p < totalPages,
      prevLink: p > 1 ? buildLink(req, p - 1, ps) : null,
      nextLink: p < totalPages ? buildLink(req, p + 1, ps) : null,
    };

    // FINAL RENDER
    res.render("courses", {
      title: "Courses",
      filters,
      ...flags, // 🔥 spread flags into template
      courses: cards,
      pagination,
    });

  } catch (err) {
    next(err);
  }
};

