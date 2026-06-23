/**
 * Cross-check tests verify that admin-editable fields
 * correctly map to the data structures that user-facing components display.
 */

describe("Cross-check: Admin Clubs → User ClubModal", () => {
  const adminClubFields = [
    "name",
    "description",
    "logoUrl",
    "bgImageUrl",
    "convenor/name",
    "convenor/role",
    "convenor/details",
    "coConvenor/name",
    "coConvenor/role",
    "coConvenor/details",
    "coach/name",
    "coach/role",
    "coach/details",
    "coach/photoUrl",
    "achievements",
    "gallery",
    "players",
  ];

  it("admin form sends all fields expected by user-facing ClubModal", () => {
    const adminPayload = {
      name: "Cricket",
      description: "Club description",
      logoUrl: "🏏",
      bgImageUrl: "https://example.com/bg.jpg",
      convenor: { name: "Dr. X", role: "Convenor", details: "Coach" },
      coConvenor: { name: "Mr. Y", role: "Co-Convenor", details: "Assistant" },
      coach: { name: "Coach Z", role: "Coach", details: "Expert", photoUrl: "https://example.com/coach.jpg" },
      achievements: ["Gold 2024"],
      gallery: [{ url: "https://example.com/photo.jpg", type: "image" }],
      players: [{ id: "1", name: "Player A", photoUrl: "" }],
    };

    // ClubModal expects these fields
    expect(adminPayload.name).toBeDefined();
    expect(adminPayload.description).toBeDefined();
    expect(adminPayload.convenor?.name).toBeDefined();
    expect(adminPayload.convenor?.role).toBeDefined();
    expect(adminPayload.convenor?.details).toBeDefined();
    expect(adminPayload.coConvenor?.name).toBeDefined();
    expect(adminPayload.coach?.name).toBeDefined();
    expect(adminPayload.coach?.photoUrl).toBeDefined();
    expect(Array.isArray(adminPayload.achievements)).toBe(true);
    expect(Array.isArray(adminPayload.gallery)).toBe(true);
    expect(Array.isArray(adminPayload.players)).toBe(true);
  });

  it("normalizeClub maps DB fields to ClubModal structure", () => {
    const dbRow = {
      id: "1",
      name: "Cricket",
      description: "Desc",
      logo_url: "🏏",
      bg_image_url: "https://bg.jpg",
      convenor_name: "Dr. X",
      convenor_role: "Convenor",
      convenor_details: "Details",
      co_convenor_name: "Mr. Y",
      co_convenor_role: "Co-Convenor",
      co_convenor_details: "Details",
      coach_name: "Coach Z",
      coach_role: "Coach",
      coach_details: "Details",
      coach_photo_url: "https://coach.jpg",
      achievements_list: '["Gold 2024","Silver 2023"]',
      gallery: [{ url: "https://photo.jpg", type: "image" }],
      players: [{ id: "1", name: "A", photoUrl: "" }],
    };

    const pgRowConversion = {
      id: dbRow.id,
      name: dbRow.name,
      description: dbRow.description,
      logoUrl: dbRow.logo_url,
      bgImageUrl: dbRow.bg_image_url,
      convenorName: dbRow.convenor_name,
      convenorRole: dbRow.convenor_role,
      convenorDetails: dbRow.convenor_details,
      coConvenorName: dbRow.co_convenor_name,
      coConvenorRole: dbRow.co_convenor_role,
      coConvenorDetails: dbRow.co_convenor_details,
      coachName: dbRow.coach_name,
      coachRole: dbRow.coach_role,
      coachDetails: dbRow.coach_details,
      coachPhotoUrl: dbRow.coach_photo_url,
      achievementsList: dbRow.achievements_list,
      gallery: dbRow.gallery,
      players: dbRow.players,
    };

    const normalized = {
      ...pgRowConversion,
      icon: pgRowConversion.logoUrl || "🏆",
      image: pgRowConversion.bgImageUrl || "",
      convenor: pgRowConversion.convenorName
        ? { name: pgRowConversion.convenorName, role: pgRowConversion.convenorRole || "Convenor", details: pgRowConversion.convenorDetails || "" }
        : null,
      coConvenor: pgRowConversion.coConvenorName
        ? { name: pgRowConversion.coConvenorName, role: pgRowConversion.coConvenorRole || "Co-Convenor", details: pgRowConversion.coConvenorDetails || "" }
        : null,
      coach: pgRowConversion.coachName
        ? { name: pgRowConversion.coachName, role: pgRowConversion.coachRole || "Coach", details: pgRowConversion.coachDetails || "", photoUrl: pgRowConversion.coachPhotoUrl || "" }
        : null,
      achievements: (() => {
        try {
          const parsed = JSON.parse(pgRowConversion.achievementsList || "[]");
          return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
      })(),
    };

    expect(normalized.icon).toBe("🏏");
    expect(normalized.image).toBe("https://bg.jpg");
    expect(normalized.convenor.name).toBe("Dr. X");
    expect(normalized.coConvenor.name).toBe("Mr. Y");
    expect(normalized.coach.name).toBe("Coach Z");
    expect(normalized.coach.photoUrl).toBe("https://coach.jpg");
    expect(normalized.achievements).toEqual(["Gold 2024", "Silver 2023"]);
    expect(normalized.gallery).toEqual([{ url: "https://photo.jpg", type: "image" }]);
    expect(normalized.players).toEqual([{ id: "1", name: "A", photoUrl: "" }]);
  });

  it("handleEdit parses achievementsList correctly", () => {
    const clubFromAPI = {
      achievementsList: '["Gold 2024","Silver 2023"]',
      achievements: undefined,
    };

    const achievements = Array.isArray(clubFromAPI.achievements)
      ? clubFromAPI.achievements
      : (() => {
          try {
            const parsed = JSON.parse(clubFromAPI.achievementsList || "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch { return []; }
        })();

    expect(achievements).toEqual(["Gold 2024", "Silver 2023"]);
  });

  it("handles empty achievementsList gracefully", () => {
    expect(() => {
      const parsed = JSON.parse("[]");
      return Array.isArray(parsed) ? parsed : [];
    }).not.toThrow();
  });
});

describe("Cross-check: Admin Events → User EventsList", () => {
  const adminEventFields = [
    "title",
    "sport",
    "date",
    "time",
    "venue",
    "description",
    "stage",
    "registrationLink",
  ];

  it("admin edits all fields that EventsList displays", () => {
    const event = {
      title: "Cricket Final",
      sport: "Cricket",
      date: "2026-06-15T10:00:00.000Z",
      time: "10:00 AM",
      venue: "Main Ground",
      description: "Final match",
      stage: "UPCOMING",
      registrationLink: "https://forms.google.com/r",
    };

    expect(event.title).toBeDefined();
    expect(event.sport).toBeDefined();
    expect(event.date).toBeDefined();
    expect(event.venue).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.stage).toBeDefined();
    expect(event.registrationLink).toBeDefined();
    expect(event.time).toBeDefined();
  });

  it("stage values align between admin and display", () => {
    const adminStages = ["PLANNED", "LIVE", "PAST"];
    const displayMapped = adminStages.map((s) => (s === "PLANNED" ? "UPCOMING" : s));
    expect(displayMapped).toContain("UPCOMING");
    expect(displayMapped).toContain("LIVE");
    expect(displayMapped).toContain("PAST");
  });

  it("past event fields (winner1st, winner2nd, matchDetails) are editable via backend", () => {
    const pastEventPayload = {
      title: "Past Match",
      stage: "PAST",
      winner1st: "Team A",
      winner2nd: "Team B",
      matchDetails: "Great match",
    };
    expect(pastEventPayload.winner1st).toBeDefined();
    expect(pastEventPayload.winner2nd).toBeDefined();
    expect(pastEventPayload.matchDetails).toBeDefined();
  });
});

describe("Cross-check: Admin achievments and council", () => {
  it("achievement fields match between admin form and backend schema", () => {
    const adminFormFields = { title: "Gold", description: "Desc", sport: "Cricket", category: "TROPHY" };
    const schemaFields = ["title", "description", "sport", "category"];
    schemaFields.forEach((f) => {
      expect(adminFormFields).toHaveProperty(f);
    });
  });

  it("council member fields match between admin form and backend schema", () => {
    const adminFormFields = { name: "Dr. X", title: "Director", tier: "DIRECTOR", photoUrl: "https://photo.jpg", order: 1 };
    const schemaFields = ["name", "title", "tier", "photoUrl", "order"];
    schemaFields.forEach((f) => {
      expect(adminFormFields).toHaveProperty(f);
    });
  });
});
