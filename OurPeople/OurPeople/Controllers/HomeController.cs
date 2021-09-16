using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace OurPeople.Controllers
{
    public class HomeController : Controller
	{
		private const int PAGE_SIZE = 3;

		private readonly IList<Staff> _people;

		public HomeController()
		{
			_people = new List<Staff>
			{
				new Staff { Name = "Daniel Lo Nigro", GithubUsername = "Daniel15", Text = "First!!!!111!" },
				new Staff { Name = "Christopher Chedeau", GithubUsername = "vjeux", Text = "React is awesome!" },
				new Staff { Name = "Christoph Pojer", GithubUsername = "cpojer", Text = "Awesome!" },
				new Staff { Name = "Jordan Walke", GithubUsername = "jordwalke", Text = "Hello World" },
				new Staff { Name = "Paul O'Shannessy", GithubUsername = "zpao", Text = "Foo" },
				new Staff { Name = "Paul O'Shannessy", GithubUsername = "zpao", Text = "Bar" },
				new Staff { Name = "Paul O'Shannessy", GithubUsername = "zpao", Text = "FooBarBaz" },
			};
		}

		public ActionResult Index()
		{
			return View(new IndexViewModel
			{
				People = _people.Take(PAGE_SIZE).ToList().AsReadOnly(),
				PageSize = PAGE_SIZE,
				Page = 1
			});
		}

		public ActionResult People(int page)
		{
			var people = _people.Skip((page - 1) * PAGE_SIZE).Take(PAGE_SIZE);
			var hasMore = page * PAGE_SIZE < _people.Count;

			if (ControllerContext.HttpContext.Request.ContentType == "application/json")
			{
				return new JsonResult(new
				{
					people = people,
					hasMore = hasMore
				});
			}
			else
			{
				return View("~/Views/Home/Index.cshtml", new IndexViewModel
				{
					People = _people.Take(PAGE_SIZE * page).ToList().AsReadOnly(),
					PageSize = PAGE_SIZE,
					Page = page
				});
			}
		}

		public class Staff
		{
			public string Name { get; set; }
			public string GithubUsername { get; set; }
			public string Text { get; set; }
		}

		public class IndexViewModel
		{
			public IReadOnlyList<Staff> People { get; set; }
			public int PageSize { get; set; }
			public int Page { get; set; }
		}
	}
}
