const grade = {
  0: "Freshman",
  1: "Sophomore",
  2: "Junior",
  3: "Senior",
  4: "Graduate",
  5: "Industry",
  6: "The GoAT"
};

export default function getGrade(score)
{
  return grade[score];
}
